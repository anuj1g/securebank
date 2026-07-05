const { getQueueSnapshot } = require("../utils/queueHelpers");

let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    
    
    socket.on("joinCategoryRoom", (categoryId) => {
      socket.join(`category:${categoryId}`);
    });

    socket.on("leaveCategoryRoom", (categoryId) => {
      socket.leave(`category:${categoryId}`);
    });

    socket.on("disconnect", () => {
      
    });
  });
}



async function broadcastQueueUpdate(categoryId) {
  if (!ioInstance) return;
  const snapshot = await getQueueSnapshot(categoryId);
  ioInstance.to(`category:${categoryId}`).emit("queueUpdated", snapshot);
}

module.exports = { initSocket, broadcastQueueUpdate };
