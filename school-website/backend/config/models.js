const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// User model (Admin, Teacher, Student)
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'teacher', 'student'), defaultValue: 'student' },
  phone: { type: DataTypes.STRING(20) },
  avatar: { type: DataTypes.STRING(255) },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) user.password = await bcrypt.hash(user.password, 12);
    }
  }
});

// Student Profile
const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
  studentId: { type: DataTypes.STRING(20), unique: true },
  dateOfBirth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
  address: { type: DataTypes.TEXT },
  parentName: { type: DataTypes.STRING(100) },
  parentPhone: { type: DataTypes.STRING(20) },
  className: { type: DataTypes.STRING(50) },
  section: { type: DataTypes.STRING(10) },
  admissionDate: { type: DataTypes.DATEONLY },
  bloodGroup: { type: DataTypes.STRING(5) }
});

// Teacher Profile
const Teacher = sequelize.define('Teacher', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
  teacherId: { type: DataTypes.STRING(20), unique: true },
  subject: { type: DataTypes.STRING(100) },
  qualification: { type: DataTypes.STRING(200) },
  experience: { type: DataTypes.INTEGER },
  joiningDate: { type: DataTypes.DATEONLY },
  salary: { type: DataTypes.DECIMAL(10, 2) }
});

// Admission Application
const Admission = sequelize.define('Admission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  applicantName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
  gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  previousSchool: { type: DataTypes.STRING(200) },
  applyingForClass: { type: DataTypes.STRING(20), allowNull: false },
  parentName: { type: DataTypes.STRING(100), allowNull: false },
  parentPhone: { type: DataTypes.STRING(20), allowNull: false },
  parentEmail: { type: DataTypes.STRING(150) },
  parentOccupation: { type: DataTypes.STRING(100) },
  documents: { type: DataTypes.JSON },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  remarks: { type: DataTypes.TEXT }
});

// Attendance
const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { type: DataTypes.INTEGER, references: { model: 'Students', key: 'id' } },
  teacherId: { type: DataTypes.INTEGER, references: { model: 'Teachers', key: 'id' } },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('present', 'absent', 'late', 'excused'), allowNull: false },
  className: { type: DataTypes.STRING(50) },
  subject: { type: DataTypes.STRING(100) },
  remarks: { type: DataTypes.STRING(255) }
});

// Exam Result
const ExamResult = sequelize.define('ExamResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { type: DataTypes.INTEGER, references: { model: 'Students', key: 'id' } },
  examName: { type: DataTypes.STRING(100), allowNull: false },
  subject: { type: DataTypes.STRING(100), allowNull: false },
  className: { type: DataTypes.STRING(50) },
  totalMarks: { type: DataTypes.INTEGER, allowNull: false },
  obtainedMarks: { type: DataTypes.INTEGER, allowNull: false },
  grade: { type: DataTypes.STRING(5) },
  examDate: { type: DataTypes.DATEONLY },
  remarks: { type: DataTypes.STRING(255) }
});

// Notice/Announcement
const Notice = sequelize.define('Notice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.ENUM('general', 'exam', 'holiday', 'event', 'urgent'), defaultValue: 'general' },
  targetAudience: { type: DataTypes.ENUM('all', 'students', 'teachers', 'parents'), defaultValue: 'all' },
  publishedBy: { type: DataTypes.INTEGER },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  expiryDate: { type: DataTypes.DATEONLY }
});

// Associations
User.hasOne(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Teacher, { foreignKey: 'userId' });
Teacher.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Student, Teacher, Admission, Attendance, ExamResult, Notice, sequelize };
