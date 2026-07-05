// Run with: node seed.js
// Populates a few service categories, one counter, and a staff account
// so you have something to test against immediately.
require("dotenv").config();
const mongoose = require("mongoose");
const ServiceCategory = require("./models/ServiceCategory");
const Counter = require("./models/Counter");
const Staff = require("./models/Staff");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await ServiceCategory.deleteMany({});
  await Counter.deleteMany({});
  await Staff.deleteMany({});

  const categories = await ServiceCategory.insertMany([
    { name: "Account Opening", icon: "user-plus", avgServiceTimeMinutes: 6 },
    { name: "Deposit/Withdrawal", icon: "cash", avgServiceTimeMinutes: 3 },
    { name: "Loan Enquiry", icon: "report-money", avgServiceTimeMinutes: 8 },
    { name: "Cheque Book Request", icon: "checkbook", avgServiceTimeMinutes: 4 },
  ]);

  
  
  
  const staffData = [
    { staffId: "STF-101", name: "Rahul Verma", password: "password123", role: "staff" },
    { staffId: "STF-102", name: "Priya Sharma", password: "password123", role: "staff" },
    { staffId: "STF-103", name: "Aman Khan", password: "password123", role: "staff" },
    { staffId: "STF-104", name: "Neha Singh", password: "password123", role: "staff" },
  ];
  const staffList = [];
  for (const data of staffData) {
    staffList.push(await Staff.create(data));
  }

  await Counter.insertMany([
    { name: "Counter 1", category: categories[0]._id, assignedStaff: staffList[0]._id }, // Account Opening
    { name: "Counter 2", category: categories[1]._id, assignedStaff: staffList[1]._id }, // Deposit/Withdrawal
    { name: "Counter 3", category: categories[2]._id, assignedStaff: staffList[2]._id }, // Loan Enquiry
    { name: "Counter 4", category: categories[3]._id, assignedStaff: staffList[3]._id }, // Cheque Book Request
  ]);

  console.log("Seed data created. Staff logins (all use password123):");
  console.log("STF-101 -> Counter 1 (Account Opening)");
  console.log("STF-102 -> Counter 2 (Deposit/Withdrawal)");
  console.log("STF-103 -> Counter 3 (Loan Enquiry)");
  console.log("STF-104 -> Counter 4 (Cheque Book Request)");
  process.exit(0);
}

seed();