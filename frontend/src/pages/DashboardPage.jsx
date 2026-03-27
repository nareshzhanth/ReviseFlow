import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { getDashboard } from "../lib/api";

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="glass-card p-5 space-y-3 cursor-default"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

function RevisionTracker({ revNum, dayLabel, done, pending, delay }) {
  const total = done + pending;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-primary" />
          <h4 className="font-display font-semibold">Revision {revNum}</h4>
          <span className="text-xs text-muted-foreground">({dayLabel})</span>
        </div>
        <span className="text-sm font-bold text-primary">{percentage}%</span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-secondary/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-primary"
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-success" /> {done} completed
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {pending} pending
        </span>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getDashboard().then(setDashboard);
  }, []);

  const revisionRows = useMemo(() => {
    const source = dashboard?.revisionBreakdown || [];

    return [
      {
        revNum: 1,
        dayLabel: "Day 1",
        ...source.find((item) => Number(item.revisionDay) === 1),
      },
      {
        revNum: 2,
        dayLabel: "Day 3",
        ...source.find((item) => Number(item.revisionDay) === 3),
      },
      {
        revNum: 3,
        dayLabel: "Day 7",
        ...source.find((item) => Number(item.revisionDay) === 7),
      },
    ].map((item) => ({
      ...item,
      completed: Number(item.completed || 0),
      pending: Number(item.pending || 0),
    }));
  }, [dashboard]);

  if (!dashboard) {
    return (
      <AppLayout>
        <div className="glass-card p-12 text-center text-muted-foreground">
          Loading dashboard...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="fade-up space-y-6 pb-20 md:pb-0">
        <div>
          <h2 className="font-display text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Track your revision progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            icon={BookOpen}
            label="Total Problems"
            value={dashboard.totalProblems}
            color="bg-primary/15 text-primary"
            delay={0}
          />
          <StatCard
            icon={CheckCircle2}
            label="Revisions Done"
            value={dashboard.completedRevisions}
            color="bg-success/15 text-success"
            delay={0.05}
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={dashboard.pendingRevisions}
            color="bg-destructive/15 text-destructive"
            delay={0.1}
          />
        </div>

        <div>
          <h3 className="font-display font-semibold mb-3">Revision Progress</h3>
          <div className="space-y-3">
            {revisionRows.map((row, index) => (
              <RevisionTracker
                key={row.revNum}
                revNum={row.revNum}
                dayLabel={row.dayLabel}
                done={row.completed}
                pending={row.pending}
                delay={0.15 + index * 0.05}
              />
            ))}
          </div>
        </div>

        {dashboard.topicCounts?.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5"
          >
            <h3 className="font-display font-semibold mb-4">Topics Covered</h3>
            <div className="flex flex-wrap gap-2">
              {dashboard.topicCounts.map((topic) => (
                <motion.div
                  key={topic.topic}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 cursor-default"
                >
                  <span className="text-sm font-medium">{topic.topic}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                    {topic.count}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </AppLayout>
  );
}
