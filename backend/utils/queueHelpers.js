const QueueEntry = require("../models/QueueEntry");
const ServiceCategory = require("../models/ServiceCategory");


function prefixFor(categoryName) {
  return categoryName.trim().charAt(0).toUpperCase();
}



async function generateToken(category) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const countToday = await QueueEntry.countDocuments({
    category: category._id,
    joinedAt: { $gte: startOfDay },
  });

  const number = String(countToday + 1).padStart(3, "0");
  return `${prefixFor(category.name)}-${number}`;
}




async function getQueueSnapshot(categoryId) {
  const category = await ServiceCategory.findById(categoryId);
  const entries = await QueueEntry.find({
    category: categoryId,
    status: { $in: ["waiting", "called"] },
  }).sort({ joinedAt: 1 });

  const avgTime = category ? category.avgServiceTimeMinutes : 5;

  return entries.map((entry, index) => ({
    id: entry._id,
    tokenNumber: entry.tokenNumber,
    customerName: entry.customerName,
    status: entry.status,
    position: index + 1,
    estimatedWaitMinutes: index * avgTime,
  }));
}

module.exports = { generateToken, getQueueSnapshot };
