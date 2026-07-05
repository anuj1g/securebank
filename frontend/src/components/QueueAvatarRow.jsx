import { motion, AnimatePresence } from "framer-motion";



export default function QueueAvatarRow({ people, myEntryId }) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <AnimatePresence>
        {people.map((person) => {
          const isMe = String(person.id) === String(myEntryId);
          return (
            <motion.div
              key={person.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex items-center justify-center rounded-full ${
                isMe ? "w-9 h-9 bg-primary-light border-2 border-primary" : "w-7 h-7 bg-line"
              }`}
              title={isMe ? "You" : person.tokenNumber}
            >
              <span className={isMe ? "text-primary text-sm" : "text-gray-400 text-xs"}>👤</span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <span className="text-gray-400 text-sm mx-1">→</span>
      <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">🧑‍💼</div>
    </div>
  );
}
