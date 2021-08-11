import { DataTypes } from 'sequelize'
import sequelize from '../config/sequelize'

export const Student = sequelize.define('student', {
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
  suspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {timestamps: false})

export const Tutor = sequelize.define('tutor', {
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
}, {timestamps: false})

export const Tutors_Students = sequelize.define('Tutors_Students', {}, { timestamps: false })

Student.belongsToMany(Tutor, { through: Tutors_Students })
Tutor.belongsToMany(Student, { through: Tutors_Students })

sequelize.sync()