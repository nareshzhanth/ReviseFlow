import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { addProblem } from "../lib/api";

const QUICK_TOPICS = [
  "Arrays",
  "Strings",
  "Trees",
  "Graphs",
  "DP",
  "Math",
  "Sorting",
  "Recursion",
  "Linked List",
  "Stack",
];

export default function AddProblemPage() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !topic.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await addProblem({ name: title.trim(), topic: topic.trim() });
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="fade-up max-w-lg mx-auto space-y-6 pb-20 md:pb-0">
        <div>
          <h2 className="font-display text-3xl font-bold">Add Problem</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Log a problem you solved today. We&apos;ll schedule 3 revisions.
          </p>
        </div>

        {error ? (
          <div className="glass-card p-4 text-sm text-destructive">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Problem Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g., Two Sum, Binary Search Tree..."
              className="w-full rounded-xl bg-secondary/50 border border-border/50 h-12 px-4 text-base placeholder:text-muted-foreground/60 outline-none focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Topic</label>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g., Arrays, Dynamic Programming..."
              className="w-full rounded-xl bg-secondary/50 border border-border/50 h-12 px-4 text-base placeholder:text-muted-foreground/60 outline-none focus:border-primary/40"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_TOPICS.map((quickTopic) => (
                <button
                  type="button"
                  key={quickTopic}
                  onClick={() => setTopic(quickTopic)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    topic === quickTopic
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
                  }`}
                >
                  {quickTopic}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Revision Schedule</span>
            </div>
            <div className="flex gap-2">
              {[
                { day: 0, label: "Day 0", desc: "Learn" },
                { day: 1, label: "Day 1", desc: "Rev 1" },
                { day: 3, label: "Day 3", desc: "Rev 2" },
                { day: 7, label: "Day 7", desc: "Rev 3" },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex-1 text-center py-2 rounded-lg bg-secondary/50 text-xs"
                >
                  <span className="block text-foreground font-semibold">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 text-base font-semibold gap-2 rounded-xl bg-primary text-primary-foreground inline-flex items-center justify-center hover:opacity-95 disabled:opacity-60"
          >
            <Plus className="w-5 h-5" />
            {submitting ? "Adding..." : "Add Problem"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
