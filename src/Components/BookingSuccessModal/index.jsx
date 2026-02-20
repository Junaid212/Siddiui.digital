import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Calendar, Clock, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import moment from "moment";

export default function BookingSuccessModal({ open, onClose, date, timeSlot }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>

            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

            <div className="px-8 pt-8 pb-8 text-center">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-red-400" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white mb-2"
              >
                Booking Confirmed!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-white/50 mb-6"
              >
                Your consultation has been successfully scheduled.
              </motion.p>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white/35 font-medium">Date</p>
                    <p className="text-sm font-semibold text-white">
                      {date ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white/35 font-medium">Time</p>
                    <p className="text-sm font-semibold text-white">
                      {timeSlot || "—"}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={onClose}
                  className="w-full h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl shadow-red-900/50 border border-red-500/40 transition-all"
                >
                  Done
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}