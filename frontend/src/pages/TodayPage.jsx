import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Flame, Zap } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { getTodayRevisions, updateRevision } from "../lib/api";

function RevisionBadge({ number }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
      Rev {number}
    </span>
  );
}

export default function TodayPage() {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState(new Set());

  async function loadRevisions() {
    setLoading(true);

    try {
      const data = await getTodayRevisions();
      setRevisions(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRevisions();
  }, []);

  const handleComplete = async (revisionId) => {
    setCompletedIds((previous) => new Set(previous).add(revisionId));

    try {
      await updateRevision(revisionId, "completed");
      setTimeout(() => {
        loadRevisions();
      }, 600);
    } catch (_error) {
      setCompletedIds((previous) => {
        const next = new Set(previous);
        next.delete(revisionId);
        return next;
      });
    }
  };

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const pending = revisions.filter(
    (revision) =>
      revision.status !== "completed" && !completedIds.has(revision.id)
  );
  const done = revisions.filter(
    (revision) =>
      revision.status === "completed" || completedIds.has(revision.id)
  );

  return (
    <AppLayout>
      <div className="fade-up space-y-6 pb-20 md:pb-0">
        <div>
          <p className="text-muted-foreground text-sm">{today}</p>
          <h2 className="font-display text-3xl font-bold mt-1">
            Today&apos;s Revisions
          </h2>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{pending.length} pending</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>{done.length} done</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            Loading today&apos;s revisions...
          </div>
        ) : null}

        {!loading && revisions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              All caught up!
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              No revisions due today. Add new problems to start building your
              revision schedule.
            </p>
          </motion.div>
        ) : null}

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {revisions.map((revision) => {
              const isCompleted =
                revision.status === "completed" || completedIds.has(revision.id);

              return (
                <motion.div
                  key={revision.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isCompleted ? 0.5 : 1,
                    y: 0,
                    scale: isCompleted ? 0.98 : 1,
                  }}
                  exit={{ opacity: 0, x: 50, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`glass-card p-4 flex items-center gap-4 cursor-pointer group transition-all hover:border-primary/30 ${
                    isCompleted ? "line-through" : ""
                  }`}
                  onClick={() =>
                    !isCompleted ? handleComplete(revision.id) : undefined
                  }
                >
                  <button
                    type="button"
                    className="shrink-0 transition-transform group-hover:scale-110"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        isCompleted ? "text-muted-foreground" : ""
                      }`}
                    >
                      {revision.problem_name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {revision.revision_date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <RevisionBadge
                      number={
                        revision.revision_day === 1
                          ? 1
                          : revision.revision_day === 3
                            ? 2
                            : 3
                      }
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {!loading && revisions.length > 0 && pending.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center glow-primary"
          >
            <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-display font-semibold text-lg">You&apos;re on fire!</p>
            <p className="text-sm text-muted-foreground">
              All revisions for today are complete.
            </p>
          </motion.div>
        ) : null}
      </div>
    </AppLayout>
  );
}
