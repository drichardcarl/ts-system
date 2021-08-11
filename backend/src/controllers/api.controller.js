import { successResponse, errorResponse } from "../utils"
import { Tutor, Student } from "../models"

export const registerStudents = async (req, res) => {
  try {
    let { tutor, students } = req.body

    try { tutor = await Tutor.create({ email: tutor }) }
    catch { tutor = await Tutor.findOne({ where: { email: tutor } }) }
    
    await Promise.all(students.map(async s => {
      let stud
      try { stud = await Student.create({ email: s }) }
      catch { stud = await Student.findOne({ where: { email: s } }) }
      await tutor.addStudent(stud)
    }))

    return successResponse(req, res, {}, 204);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getCommonStudents = async (req, res) => {
  try {
    const payload = typeof req.query.tutor === 'string'
      ? [req.query.tutor]
      : req.query.tutor

    const tutors = await Promise.all(payload.map(async t => {
      return await Tutor.findOne({
        where: {email: t},
        include: [{
          model: Student,
          through: { attributes: [] }
        }]
      })
    }))
    
    const students = tutors.reduce((students, tutor) => {
      if (!students.length) return []
      return students.filter(s => (tutor?.students || []).map(ss => ss.id).includes(s.id))
    }, tutors[0]?.students || [])
    
    return successResponse(req, res, { students }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

export const suspendStudent = async (req, res) => {
  try {
    const { student, suspend } = req.body
    await Student.update(
      { suspended: suspend }, {
        where: {email: student}
      }
    )
    return successResponse(req, res, {}, 204);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

export const getNotifications = async (req, res) => {
  try {
    let { tutor, notification } = req.body
    const students = (await Tutor.findOne({
      where: { email: tutor },
      include: {
        model: Student,
        where: { suspended: false },
        through: { attributes: [] }
      }
    }))?.students || []
    await Promise.all(
      (notification.match(/@[\w\d\-@._]+/g) || [])
        .map(mention => mention.slice(1))
        .filter(mention => !students.map(s => s.email).includes(mention))
        .map(async mention => {
          const stud = await Student.findOne({
            where: { email: mention, suspended: false },
          })
          if (stud) students.push(stud)
        })
    )
    return successResponse(req, res, { recipients: students }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}
