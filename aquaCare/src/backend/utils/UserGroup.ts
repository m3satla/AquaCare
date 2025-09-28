import mongoose from 'mongoose';

// סכמת משנה עבור חבר קבוצה
const groupMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['מטפל', 'מטופל', 'בן משפחה'],
    required: true
  }
});

// סכמת הקבוצה
const userGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  members: [groupMemberSchema] // מערך של חברים
}, { timestamps: true });

const UserGroupModel = mongoose.model('UserGroup', userGroupSchema);
export default UserGroupModel;
