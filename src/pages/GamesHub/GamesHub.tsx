import React, { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  TreePine, RefreshCw, Trophy, AlertTriangle, Sprout, Droplets,
  BarChart3, Activity, Gamepad2, ExternalLink, CheckCircle2,
  Play, Video, X, Sparkles, Globe, Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { apiService, ApiError, sanitizeUrl } from "../../services/api";
import { RouteLoader } from "../../components/common/RouteLoader";
import { EmptyState } from "../../components/ui/EmptyState";
import type { CarbonQuestion, Game } from "../../types";
import { SEO } from "../../components/common/SEO";
import { setScrollLocked } from "../../components/layout/scrollController";
import "./GamesHub.css";

/** ثمن زراعة شجرة غاف افتراضية — نفس الرقم يظهر في النص وفي زر الزراعة. */
const TREE_COST = 40;

type LocalGameKey = "calculator" | "garden";

/**
 * أي لعبة يردّها الـ API لها تطبيق محلي داخل الصفحة؟
 * الباقي يُعرض كرابط خارجي عبر sanitizeUrl بدل زر ميت.
 */
const LOCAL_GAME_BY_ID: Record<string, LocalGameKey> = {
  "carbon-footprint": "calculator",
  "carbon-simulator": "calculator",
  "ghaf-tree-grower": "garden",
  "ghaf-garden": "garden",
};

const resolveLocalGame = (game: Game): LocalGameKey | null => {
  const direct = LOCAL_GAME_BY_ID[game.id];
  if (direct) return direct;
  const id = (game.id || "").toLowerCase();
  if (id.includes("carbon") || id.includes("footprint")) return "calculator";
  if (id.includes("ghaf") || id.includes("garden") || id.includes("tree")) return "garden";
  return null;
};

const GAME_ICONS: Record<string, LucideIcon> = {
  Activity,
  BarChart3,
  TreePine,
  Sprout,
  Droplets,
  Gamepad2,
};

const iconForGame = (game: Game, local: LocalGameKey | null): LucideIcon => {
  const named = GAME_ICONS[game.icon];
  if (named) return named;
  if (local === "calculator") return BarChart3;
  if (local === "garden") return Sprout;
  return Gamepad2;
};

/** رسالة خطأ جاهزة للعرض مهما كان نوع الاستثناء. */
const describeError = (err: unknown, language: string): string => {
  if (err instanceof ApiError) return err.localizedMessage(language);
  return language === "ar" ? "حدث خطأ غير متوقع." : "An unexpected error occurred.";
};

/**
 * الـ store قد يردّ `boolean` أو `{ ok, error }` أو `{ success, message }`.
 * نقرأ الثلاثة دفاعياً بدل افتراض شكل واحد.
 */
const interpretResult = (result: unknown): { ok: boolean; error?: string } => {
  if (typeof result === "boolean") return { ok: result };
  if (result && typeof result === "object") {
    const r = result as Record<string, unknown>;
    const ok =
      typeof r.ok === "boolean" ? r.ok :
      typeof r.success === "boolean" ? r.success :
      false;
    const error =
      typeof r.error === "string" ? r.error :
      typeof r.message === "string" && !ok ? r.message :
      undefined;
    return error === undefined ? { ok } : { ok, error };
  }
  return { ok: false };
};

export const GamesHub: React.FC = () => {
  const { language, t } = useLanguage();
  const ar = language === "ar";
  const [activeGame, setActiveGame] = useState<LocalGameKey | null>(null);
  const [videoGame, setVideoGame] = useState<Game | null>(null);

  // ── الاشتراك في الـ store بمُحدِّدات، لا getState() داخل الـ JSX ──
  const stats = useAuthStore((s) => s.stats);
  const profileLoading = useAuthStore((s) => s.loading);
  const profileError = useAuthStore((s) => s.error);
  const loadUserProfile = useAuthStore((s) => s.loadUserProfile);
  const saveCarbonFootprint = useAuthStore((s) => s.saveCarbonFootprint);
  const plantVirtualTree = useAuthStore((s) => s.plantVirtualTree);

  // ── قائمة الألعاب من الـ API ──
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [gamesReload, setGamesReload] = useState(0);

  // ── أسئلة لعبة محاكاة البصمة الكربونية ──
  const [questions, setQuestions] = useState<CarbonQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [questionsReload, setQuestionsReload] = useState(0);

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [finalFootprint, setFinalFootprint] = useState<number | null>(null);

  // ── حالة حفظ النتيجة (بديل alert) ──
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // ── رسائل الحديقة (بديل alert) ──
  const [gardenMessage, setGardenMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setGamesLoading(true);
      setGamesError(null);
      try {
        const data = await apiService.getGames();
        if (controller.signal.aborted) return;
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setGames([]);
        setGamesError(describeError(err, language));
      } finally {
        if (!controller.signal.aborted) setGamesLoading(false);
      }
    })();
    return () => controller.abort();
  }, [language, gamesReload]);

  useEffect(() => {
    if (activeGame !== "calculator") return;
    const controller = new AbortController();
    (async () => {
      setQuestionsLoading(true);
      setQuestionsError(null);
      try {
        const data = await apiService.getCarbonQuestions();
        if (controller.signal.aborted) return;
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setQuestions([]);
        setQuestionsError(describeError(err, language));
      } finally {
        if (!controller.signal.aborted) setQuestionsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [activeGame, language, questionsReload]);

  useEffect(() => {
    if (!videoGame) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVideoGame(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [videoGame]);

  const resetGame = useCallback(() => {
    setStep(0);
    setScores([]);
    setFinalFootprint(null);
    setSaveStatus("idle");
    setSaveMessage(null);
  }, []);

  const handleAnswer = (value: number) => {
    const nextScores = [...scores, value];
    setScores(nextScores);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // حساب البصمة الكلية بالطن كربون سنوياً
      const sum = nextScores.reduce((a, b) => a + b, 0);
      setFinalFootprint(parseFloat(sum.toFixed(1)));
    }
  };

  // يا مطور الباك: النتيجة دي بتتبعت على POST /user/carbon-footprint وبتتسجل في الـ profile
  const saveScoreToDashboard = async () => {
    // ملاحظة: بصمة 0 نتيجة صحيحة تماماً (أفضل نتيجة ممكنة) — لازم تُحفظ.
    if (finalFootprint === null) return;
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage(null);
    try {
      const raw = await Promise.resolve(saveCarbonFootprint(finalFootprint));
      const { ok, error } = interpretResult(raw);
      if (ok) {
        setSaveStatus("success");
        setSaveMessage(
          ar
            ? `تم حفظ نتيجتك (${finalFootprint} طن) في لوحة تحكم الأعضاء.`
            : `Your score (${finalFootprint} tons) has been saved to your dashboard.`
        );
        return;
      }
      setSaveStatus("error");
      setSaveMessage(
        error ||
          (ar
            ? "تعذّر حفظ النتيجة. برجاء المحاولة مرة أخرى."
            : "We could not save your score. Please try again.")
      );
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(describeError(err, language));
    }
  };

  const handlePlantTree = async () => {
    setGardenMessage(null);
    try {
      const raw = await Promise.resolve(plantVirtualTree("الغاف المباركة", "Blessed Ghaf", TREE_COST));
      const { ok, error } = interpretResult(raw);
      if (ok) {
        setGardenMessage({
          tone: "success",
          text: ar
            ? "مبروك! زرعت شجرة غاف جديدة وتمت إضافتها للوحتك."
            : "Congrats! A new Ghaf tree was added to your garden.",
        });
        return;
      }
      setGardenMessage({
        tone: "error",
        text:
          error ||
          (ar
            ? `عفواً، رصيد النقاط غير كافٍ (تحتاج ${TREE_COST} نقطة). شارك في الأنشطة لجمع النقاط!`
            : `Not enough eco points (you need ${TREE_COST}). Join activities to earn more!`),
      });
    } catch (err) {
      setGardenMessage({ tone: "error", text: describeError(err, language) });
    }
  };

  const openGame = (key: LocalGameKey) => {
    setActiveGame(key);
    setGardenMessage(null);
    if (key === "calculator") resetGame();
  };

  const closeGame = () => {
    setActiveGame(null);
    setGardenMessage(null);
    resetGame();
  };

  // الحارس الذي يمنع الانهيار: السؤال الحالي قد لا يكون موجوداً إطلاقاً.
  const currentQuestion: CarbonQuestion | undefined = questions[step];
  const canPlant = stats !== null && stats.ecoPoints >= TREE_COST;

  const renderQuizBody = () => {
    if (questionsLoading) {
      return <RouteLoader label={ar ? "جارٍ تحميل الأسئلة…" : "Loading questions…"} />;
    }

    if (questionsError) {
      return (
        <div className="games-state-block" role="alert">
          <EmptyState
            type="error"
            titleAr="تعذّر تحميل أسئلة المحاكي"
            titleEn="Could not load the simulator questions"
            descriptionAr={questionsError}
            descriptionEn={questionsError}
            actionAr="إعادة المحاولة"
            actionEn="Try again"
            onAction={() => setQuestionsReload((n) => n + 1)}
          />
        </div>
      );
    }

    if (questions.length === 0 || !currentQuestion) {
      return (
        <div className="games-state-block">
          <EmptyState
            type="no-data"
            titleAr="لا توجد أسئلة متاحة حالياً"
            titleEn="No questions available yet"
            descriptionAr="لم يُضِف الفريق أسئلة للمحاكي بعد. حاول مرة أخرى بعد قليل."
            descriptionEn="The simulator has no questions yet. Please check back shortly."
            actionAr="تحديث"
            actionEn="Refresh"
            onAction={() => {
              resetGame();
              setQuestionsReload((n) => n + 1);
            }}
          />
        </div>
      );
    }

    return (
      <div className="game-questions-flow">
        <div
          className="progress-bar-steps"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-valuenow={step + 1}
          aria-valuetext={ar ? `السؤال ${step + 1} من ${questions.length}` : `Question ${step + 1} of ${questions.length}`}
          aria-label={ar ? "تقدّمك في محاكي البصمة الكربونية" : "Carbon footprint simulator progress"}
        >
          <div className="step-dots-row" aria-hidden="true">
            {questions.map((_, idx) => (
              <span key={idx} className={`dot ${idx <= step ? "active" : ""}`}></span>
            ))}
          </div>
          <p className="step-label">
            {ar ? `السؤال ${step + 1} من ${questions.length}` : `Question ${step + 1} of ${questions.length}`}
          </p>
        </div>

        <h4 className="question-text" id="carbon-question-text">
          {ar ? currentQuestion.questionAr : currentQuestion.questionEn}
        </h4>

        <div className="options-selection-grid" role="group" aria-labelledby="carbon-question-text">
          {(currentQuestion.options ?? []).map((opt, oIdx) => (
            <button
              key={oIdx}
              type="button"
              onClick={() => handleAnswer(opt.value)}
              className="option-card-btn card text-center"
            >
              {ar ? opt.textAr : opt.textEn}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGamesList = () => {
    if (gamesLoading) {
      return <RouteLoader label={ar ? "جارٍ تحميل الألعاب…" : "Loading games…"} />;
    }

    if (gamesError) {
      return (
        <div className="games-state-block" role="alert">
          <EmptyState
            type="error"
            titleAr="تعذّر تحميل الألعاب"
            titleEn="Could not load the games"
            descriptionAr={gamesError}
            descriptionEn={gamesError}
            actionAr="إعادة المحاولة"
            actionEn="Try again"
            onAction={() => setGamesReload((n) => n + 1)}
          />
        </div>
      );
    }

    if (games.length === 0) {
      return (
        <div className="games-state-block">
          <EmptyState
            type="no-data"
            titleAr="لا توجد ألعاب متاحة حالياً"
            titleEn="No games available yet"
            descriptionAr="نعمل على إضافة ألعاب مناخية جديدة. تابعنا قريباً!"
            descriptionEn="New climate games are on the way. Check back soon!"
            actionAr="تحديث"
            actionEn="Refresh"
            onAction={() => setGamesReload((n) => n + 1)}
          />
        </div>
      );
    }

    return (
      <div className="games-selection-hub-grid">
        {games.map((game) => {
          const local = resolveLocalGame(game);
          const Icon = iconForGame(game, local);
          const colorClass =
            local === "calculator" ? "calculator-color" : local === "garden" ? "garden-color" : "neutral-color";
          const href = sanitizeUrl(game.playUrl || "");
          const linkable = href !== "" && href !== "#invalid-url";
          const isFeaturedTeamGame = game.id === "agriclash" || game.id === "greensharks";

          return (
            <div key={game.id} className={`game-selector-card card text-center ${isFeaturedTeamGame ? "game-featured-card" : ""}`}>
              {isFeaturedTeamGame && (
                <div className="game-featured-badge-top">
                  <Sparkles size={12} />
                  <span>
                    {game.id === "agriclash"
                      ? ar ? "لعبة جماعية ضمن SHIFT" : "SHIFT Interactive Game"
                      : ar ? "تحدي واستراتيجية خضراء" : "Green Strategy Challenge"}
                  </span>
                </div>
              )}

              {game.id === "agriclash" ? (
                <div
                  className="game-board-card-preview"
                  onClick={() => setVideoGame(game)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setVideoGame(game);
                    }
                  }}
                  title={ar ? "انقر لمشاهدة فيديو اللعبة" : "Click to watch game video"}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src="/games/agriclash-board.webp"
                    alt="AgriClash Youth Board Simulation"
                    className="game-board-thumb"
                    loading="lazy"
                  />
                  <div className="game-board-overlay">
                    <Play size={18} fill="currentColor" />
                    <span>{ar ? "تشغيل الفيديو" : "Watch Video"}</span>
                  </div>
                </div>
              ) : game.id === "greensharks" ? (
                <div className="game-board-card-preview">
                  <img
                    src={game.image || "/games/green-sharks.webp"}
                    alt={ar ? "تحدي Green Sharks للاستثمار الأخضر" : "Green Sharks Challenge — Pitch, Innovate, Compete for a Greener Future"}
                    className="game-board-thumb"
                    loading="lazy"
                  />
                </div>
              ) : (
                <span className={`game-large-icon-wrapper ${colorClass}`} aria-hidden="true">
                  <Icon size={32} />
                </span>
              )}
              <h3>{ar ? game.titleAr : game.titleEn}</h3>
              <p>{ar ? game.descriptionAr : game.descriptionEn}</p>

              {(game.id === "agriclash" || game.id === "greensharks") && (
                <div className="game-un-meta-block">
                  <div className="game-un-meta-item">
                    <Globe size={13} className="game-un-meta-icon" />
                    <span>
                      {ar
                        ? "لعبة دولية مبنية ضمن أطر عمل الأمم المتحدة (UN Framework)"
                        : "It is an international game through UN Framework"}
                    </span>
                  </div>
                  <div className="game-un-meta-item">
                    <Users size={13} className="game-un-meta-icon" />
                    <span>
                      {ar
                        ? "طُوّرت اللعبة بأيدي الشباب ومن أجل الشباب (Youth to Youth)"
                        : "This game was developed by youth to youth"}
                    </span>
                  </div>
                </div>
              )}

              <div className="game-card-actions-box">
                {local ? (
                  <button type="button" onClick={() => openGame(local)} className="btn btn-primary">
                    {local === "calculator"
                      ? ar ? "ابدأ اللعب الآن" : "Play Simulator"
                      : ar ? "افتح حديقتك" : "Open Digital Garden"}
                  </button>
                ) : linkable ? (
                  <a
                    href={href}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{ar ? "افتح اللعبة" : "Play Game"}</span>
                    <ExternalLink size={16} aria-hidden="true" />
                    <span className="sr-only">{ar ? "(يفتح في نافذة جديدة)" : "(opens in a new tab)"}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setVideoGame(game)}
                    className="btn btn-primary game-video-trigger-btn"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>{ar ? "فيديو اللعبة (Popup)" : "Watch Game Video"}</span>
                  </button>
                )}

                {/* زر مشاهدة فيديو اللعبة التفاعلي */}
                <button
                  type="button"
                  onClick={() => setVideoGame(game)}
                  className="btn btn-ghost btn-sm game-demo-btn"
                  title={ar ? "مشاهدة الفيديو التفاعلي للعبة" : "Watch interactive game demo video"}
                >
                  <Video size={15} />
                  <span>{ar ? "فيديو توضيحي" : "Demo Video"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGarden = () => (
    <div className="garden-game-box card">
      <div className="game-box-header">
        <button type="button" onClick={closeGame} className="btn btn-ghost btn-sm">
          {ar ? "← الرجوع للألعاب" : "← Back to Games"}
        </button>
        <h3>
          <Sprout size={20} aria-hidden="true" />{" "}
          {ar ? "حديقتك الرقمية لزراعة شجرة الغاف" : "Ghaf Tree Virtual Garden"}
        </h3>
      </div>

      <div className="garden-simulator-panel text-center">
        <TreePine size={72} className="animated-tree-growing" aria-hidden="true" />

        {stats === null ? (
          <div className="games-state-block">
            <EmptyState
              type="no-data"
              titleAr="لم نُحمّل بيانات حديقتك بعد"
              titleEn="Your garden data isn't loaded yet"
              descriptionAr={
                profileError ||
                "سجّل دخولك أو حمّل ملفك الشخصي لعرض عدد أشجارك ورصيد نقاطك البيئية الحقيقي."
              }
              descriptionEn={
                profileError ||
                "Sign in or load your profile to see your real tree count and eco point balance."
              }
              actionAr={profileLoading ? "جارٍ التحميل…" : "تحميل بيانات حديقتي"}
              actionEn={profileLoading ? "Loading…" : "Load my garden data"}
              onAction={() => {
                if (!profileLoading) void loadUserProfile();
              }}
            />
          </div>
        ) : (
          <>
            <h4>
              {ar
                ? `حديقتك تحتوي حالياً على ${stats.virtualTrees} أشجار غاف صحية!`
                : `Your garden has ${stats.virtualTrees} healthy Ghaf trees!`}
            </h4>
            <p className="garden-tip">
              {ar
                ? `رصيدك الحالي: ${stats.ecoPoints} نقطة بيئية. استبدل ${TREE_COST} نقطة لزراعة شجرة جديدة ورعايتها.`
                : `Current points: ${stats.ecoPoints} Eco Points. Redeem ${TREE_COST} points to plant a new Ghaf tree.`}
            </p>

            <div className="garden-actions-row">
              <button
                type="button"
                onClick={handlePlantTree}
                className="btn btn-primary"
                disabled={!canPlant}
              >
                <Sprout size={16} aria-hidden="true" />{" "}
                {ar ? `ازرع شجرة جديدة (${TREE_COST} نقطة)` : `Plant New Tree (${TREE_COST} Pts)`}
              </button>
            </div>

            {!canPlant && (
              <p className="game-inline-alert is-warning" role="status">
                <AlertTriangle size={16} aria-hidden="true" />
                <span>
                  {ar
                    ? `تحتاج ${TREE_COST - stats.ecoPoints} نقطة إضافية لزراعة شجرة جديدة.`
                    : `You need ${TREE_COST - stats.ecoPoints} more eco points to plant a tree.`}
                </span>
              </p>
            )}
          </>
        )}

        <div className="game-live-region" aria-live="polite">
          {gardenMessage && (
            <p
              className={`game-inline-alert ${gardenMessage.tone === "success" ? "is-success" : "is-error"}`}
              role={gardenMessage.tone === "success" ? "status" : "alert"}
            >
              {gardenMessage.tone === "success" ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : (
                <AlertTriangle size={16} aria-hidden="true" />
              )}
              <span>{gardenMessage.text}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="carbon-game-box card">
      <div className="game-box-header">
        <button type="button" onClick={closeGame} className="btn btn-ghost btn-sm">
          {ar ? "← الرجوع للألعاب" : "← Back to Games"}
        </button>
        <h3>
          <BarChart3 size={20} aria-hidden="true" />{" "}
          {ar ? "محاكي البصمة الكربونية الشخصية" : "Personal Carbon Footprint Simulator"}
        </h3>
      </div>

      {finalFootprint !== null ? (
        <div className="game-result-panel text-center" role="status" aria-live="polite">
          <Trophy size={64} className="trophy-icon" aria-hidden="true" />
          <h4>{ar ? "نتيجتك النهائية جاهزة!" : "Your Carbon Footprint Result!"}</h4>
          <div className="result-number-box">
            <span className="result-num">{finalFootprint}</span>
            <span className="result-unit">{ar ? "طن كربون / سنوياً" : "Tons CO2 / Year"}</span>
          </div>

          <div className="feedback-rich-text">
            {finalFootprint > 7 ? (
              <p className="feedback-warning">
                <AlertTriangle size={18} aria-hidden="true" />
                {ar
                  ? "بصمتك الكربونية أعلى من المتوسط الإماراتي! يمكنك تقليلها بالاعتماد على وسائل النقل العام وترشيد الطاقة."
                  : "Your footprint is higher than the average. Try using public transport and saving energy."}
              </p>
            ) : (
              <p className="feedback-success">
                <TreePine size={18} aria-hidden="true" />
                {ar
                  ? "ممتاز! بصمتك الكربونية منخفضة وصديقة للبيئة. استمر في رعاية الكوكب."
                  : "Excellent! Your footprint is environment-friendly. Keep protecting the planet."}
              </p>
            )}
          </div>

          <div className="game-result-actions">
            <button
              type="button"
              onClick={saveScoreToDashboard}
              className="btn btn-primary"
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving"
                ? ar ? "جارٍ الحفظ…" : "Saving…"
                : ar ? "حفظ النتيجة في لوحة التحكم" : "Save to My Dashboard"}
            </button>
            <button type="button" onClick={resetGame} className="btn btn-ghost">
              <RefreshCw size={16} aria-hidden="true" />
              <span>{ar ? "إعادة اللعب" : "Play Again"}</span>
            </button>
          </div>

          {saveStatus === "success" && saveMessage && (
            <p className="game-inline-alert is-success" role="status">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>{saveMessage}</span>
            </p>
          )}
          {saveStatus === "error" && saveMessage && (
            <p className="game-inline-alert is-error" role="alert">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>{saveMessage}</span>
            </p>
          )}
        </div>
      ) : (
        renderQuizBody()
      )}
    </div>
  );

  return (
    <div className="games-hub-page-container container">
      <SEO
        title={ar ? "ألعاب المناخ وحاسبة البصمة الكربونية" : "Climate Games & Carbon Footprint Simulator"}
        description={
          ar
            ? "العب وتعلم مع ألعاب كلايمتفاي المناخية التفاعلية: حاسبة البصمة الكربونية، لعبة حديقة الغاف الافتراضية، وتحديات AgriClash و GreenSharks البيئية."
            : "Play interactive climate games: Personal Carbon Footprint Simulator, Ghaf Tree Grower, AgriClash and GreenSharks sustainability simulations."
        }
        breadcrumbs={[
          { name: ar ? "الرئيسية" : "Home", path: "/" },
          { name: ar ? "ألعاب المناخ" : "Climate Games", path: "/games" },
        ]}
      />
      {/* 1. Header */}
      <section className="games-header text-center">
        <span className="eyebrow">{t("gamesHub")}</span>
        <h1 className="section-title">
          {ar ? "ألعاب المناخ التعليمية التفاعلية" : "Interactive Educational Climate Games"}
        </h1>
        <p className="section-lead mx-auto">
          {ar
            ? "العب وتعلم معنا! احسب أثرك البيئي وازرع حديقتك الافتراضية لحماية البيئة."
            : "Play and learn! Calculate your environmental impact and grow your virtual garden to protect nature."}
        </p>
      </section>

      {/* 2. Games List / Active Game view */}
      <section className="games-content-section section">
        {activeGame === "calculator"
          ? renderCalculator()
          : activeGame === "garden"
            ? renderGarden()
            : renderGamesList()}
      </section>

      {/* 3. فيديو Popup للألعاب المناخية */}
      {videoGame && (
        <div className="modal-overlay game-video-overlay" data-lenis-prevent onClick={() => setVideoGame(null)}>
          <div
            className="modal-content game-video-modal card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={ar ? videoGame.titleAr : videoGame.titleEn}
          >
            <div className="game-video-header">
              <div className="game-video-title-wrap">
                <Video size={22} className="game-video-icon-accent" />
                <div>
                  <span className="game-video-tag">{ar ? "فيديو Popup للألعاب المناخية" : "Climate Games Video Preview"}</span>
                  <h3>{ar ? videoGame.titleAr : videoGame.titleEn}</h3>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm close-video-btn"
                onClick={() => setVideoGame(null)}
                aria-label={ar ? "إغلاق الفيديو" : "Close video"}
              >
                <X size={20} />
              </button>
            </div>
            <div className="game-video-screen">
              {videoGame.id === "agriclash" ? (
                <iframe
                  src="https://drive.google.com/file/d/1G8GE-SK354Ti9eAJj99ish9tLhtb7U6U/preview"
                  title={ar ? "فيديو لعبة AgriClash" : "AgriClash Game Video"}
                  className="game-video-iframe"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video
                  src="/Climatify-Campign-.mp4"
                  controls
                  autoPlay
                  className="game-video-element"
                >
                  {ar ? "متصفحك لا يدعم تشغيل الفيديو." : "Your browser does not support video."}
                </video>
              )}
            </div>
            <div className="game-video-footer">
              <p>{ar ? videoGame.descriptionAr : videoGame.descriptionEn}</p>
              
              <div className="game-un-meta-block modal-un-meta">
                <div className="game-un-meta-item">
                  <Globe size={13} className="game-un-meta-icon" />
                  <span>
                    {ar
                      ? "لعبة دولية مبنية ضمن أطر عمل الأمم المتحدة (UN Framework)"
                      : "It is an international game through UN Framework"}
                  </span>
                </div>
                <div className="game-un-meta-item">
                  <Users size={13} className="game-un-meta-icon" />
                  <span>
                    {ar
                      ? "طُوّرت اللعبة بأيدي الشباب ومن أجل الشباب (Youth to Youth)"
                      : "This game was developed by youth to youth"}
                  </span>
                </div>
              </div>

              {videoGame.id === "agriclash" && (
                <div className="game-video-actions-row">
                  <a
                    href="https://drive.google.com/file/d/1G8GE-SK354Ti9eAJj99ish9tLhtb7U6U/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm drive-video-link"
                  >
                    <ExternalLink size={14} />
                    <span>{ar ? "فتح الفيديو في Google Drive" : "Open Video in Google Drive"}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
