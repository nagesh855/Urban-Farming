import mongoose from 'mongoose'

const dashboardSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    stats: [mongoose.Schema.Types.Mixed],
    roles: [mongoose.Schema.Types.Mixed],
    features: [mongoose.Schema.Types.Mixed],
    marketplace: [mongoose.Schema.Types.Mixed],
    tasks: [mongoose.Schema.Types.Mixed],
    forum: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true },
)

const Dashboard = mongoose.model('Dashboard', dashboardSchema)

export default Dashboard
