const logger = console;
const User = require('../models/User')
const Booking = require('../models/Booking')
const Meal = require('../models/Meal')
const Review = require('../models/Review')
const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const imagedownload = require('image-downloader')
const Place = require('../models/Place')
const ContactUs = require('../models/Contact')

const Contact = async (req, res) => {
logger.error(`>>> Entering Contact(req=${req},res=${res})`, { "event.action": "Contact" });
  console.log(req.body)
  const { name, email, number, message } = req.body
  try {
    const contact = await ContactUs.create({
      name,
      email,
      number,
      message
    })
    console.log(contact)
    return res.status(201).json(contact)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Internal Server Error Please try again later' })
  }
logger.error(`<<< Exiting Contact(req=${req},res=${res})`, { "event.action": "Contact" });
}

const registerUser = async (req, res) => {
logger.error(`>>> Entering registerUser(req=${req},res=${res})`, { "event.action": "registerUser" });
  const { name, email, password } = req.body
  try {
    if (!name || !email || !password) {
      return res.status(404).json({ message: 'All fields are mandatory' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
	logger.error(`registerUser(req=${req},res=${res}): existingUser → ${existingUser}`, { "event.action": "registerUser" });
      return res.status(404).json({ message: 'User already registered' })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashPassword
    })
    return res.status(201).json(user)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error Please try again later' })
  }
logger.error(`<<< Exiting registerUser(req=${req},res=${res})`, { "event.action": "registerUser" });
}

const loginUser = async (req, res) => {
logger.error(`>>> Entering loginUser(req=${req},res=${res})`, { "event.action": "loginUser" });
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(404).json({ message: 'All fields are mandatory' })
    }
    const user = await User.findOne({ email })
    if (!user) {
	logger.error(`loginUser(req=${req},res=${res}): user → ${user}`, { "event.action": "loginUser" });
      return res.status(404).json({ message: 'User not found' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
	logger.error(`loginUser(req=${req},res=${res}): isMatch → ${isMatch}`, { "event.action": "loginUser" });
      const token = jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '150minutes' }
      )
      res.cookie('token', token)
      res.status(200).json(user)
    } else {
      return res.status(404).json({ message: 'Invalid username or password' })
    }
  } catch (err) {
	logger.error(`Exception in loginUser(req=${req},res=${res}): ${err.message}`, err, { "event.action": "loginUser", "event.category": "process" });
    return res
      .status(500)
      .json({ message: 'Internal Server Error Please try again later' })
  }
logger.error(`<<< Exiting loginUser(req=${req},res=${res})`, { "event.action": "loginUser" });
}

const getProfile = (req, res) => {
logger.error(`>>> Entering getProfile(req=${req},res=${res})`, { "event.action": "getProfile" });
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      res.json(user)
    })
  } else {
    res.json(null)
  }
	logger.error(`<<< Exiting getProfile(req=${req},res=${res})`, { "event.action": "getProfile" });
  // res.send({"Authenciated":true,data:req.user})
  // res.json(user)
}

const logoutUser = (req, res) => {
logger.error(`>>> Entering logoutUser(req=${req},res=${res})`, { "event.action": "logoutUser" });
  res.clearCookie('token')

  res.status(200).json({ message: 'hello' })
logger.error(`<<< Exiting logoutUser(req=${req},res=${res})`, { "event.action": "logoutUser" });
}

const uploadLinkPhoto = async (req, res) => {
logger.error(`>>> Entering uploadLinkPhoto(req=${req},res=${res})`, { "event.action": "uploadLinkPhoto" });
  const { link } = req.body
  const newName = Date.now() + '.jpg'
logger.error(`uploadLinkPhoto(req=${req},res=${res}): newName → ${newName}`, { "event.action": "uploadLinkPhoto" });

  const dest = path.join(__dirname, '..', 'uploads', newName)
  await imagedownload.image({
    url: link,
    dest: dest
  })
  res.status(200).json({ newName })
logger.error(`uploadLinkPhoto(req=${req},res=${res}): dest → ${dest}`, { "event.action": "uploadLinkPhoto" });
}

const addPlace = async (req, res) => {
logger.error(`>>> Entering addPlace(req=${req},res=${res})`, { "event.action": "addPlace" });
  const {
    title,
    address,
    addedPhotos,
    price,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    updatedMeals
  } = req.body

  const { token } = req.cookies
  let user

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, currentUser) => {
    if (err) throw err
    user = currentUser
  })

  try {
    // Create meals and associate them with the place
    const meals = {
      mealType: updatedMeals.mealType,
      mealPrice: updatedMeals.mealPrice
    }

    const meal = await Meal.create(meals)
    // Create the place
	logger.error(`addPlace(req=${req},res=${res}): meal → ${meal}`, { "event.action": "addPlace" });
    const place = await Place.create({
      owner: user.id,
      title,
      address,
      photos: addedPhotos,
      price,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      meals: meal._id
    })

    return res.status(201).json({ place })
  } catch (error) {
    console.error(error)
logger.error(`<<< Exiting addPlace(req=${req},res=${res})`, { "event.action": "addPlace" });
    return res.status(500).json({ error: 'Server error' })
  }
}

const getPlaces = async (req, res) => {
logger.error(`>>> Entering getPlaces(req=${req},res=${res})`, { "event.action": "getPlaces" });
  const { token } = req.cookies
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
  // console.log(user.id)
    if (err) throw err
    res.json(await Place.find({ owner: currentUser.id }))
  })
}

const getSinglePlace = async (req, res) => {
logger.error(`>>> Entering getSinglePlace(req=${req},res=${res})`, { "event.action": "getSinglePlace" });
  // console.log(req.body)
  const { id } = req.body

const __log_start = Date.now();
  try {
    const place = await Place.findById(id).populate('meals')

	logger.error(`getSinglePlace(req,res)=${req},${res}: find operation took ${Date.now() - __log_start} ms`, { "event.action": "getSinglePlace", "event.category": "database" });
    if (!place) {
      return res.status(404).json({ error: 'Place not found' })
    }
    console.log(place)
    return res.json({ place })
  } catch (error) {
    console.error(error)
logger.error(`<<< Exiting getSinglePlace(req=${req},res=${res})`, { "event.action": "getSinglePlace" });
    return res.status(500).json({ error: 'Server error' })
  }
}

const updatePlace = async (req, res) => {
logger.error(`>>> Entering updatePlace(req=${req},res=${res})`, { "event.action": "updatePlace" });
  // console.log(req.body)
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body
  const { token } = req.cookies
  let user

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, currentUser) => {
    if (err) throw err
    user = currentUser
  })

  try {
    const place = await Place.findByIdAndUpdate(id, {
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    })
    // console.log(place)
    return res.status(201).json({ place })
  } catch (error) {
    console.error(error)
logger.error(`<<< Exiting updatePlace(req=${req},res=${res})`, { "event.action": "updatePlace" });
    return res.status(500).json({ error: 'Server error' })
  }
}

const removePlace = async (req, res) => {
logger.error(`>>> Entering removePlace(req=${req},res=${res})`, { "event.action": "removePlace" });
  const { id } = req.body
  try {
    const place = await Place.findByIdAndDelete(id)
    return res.status(201).json({ place })
  } catch (error) {
	logger.error(`removePlace(req=${req},res=${res}): place → ${place}`, { "event.action": "removePlace" });
    console.error(error)
logger.error(`<<< Exiting removePlace(req=${req},res=${res})`, { "event.action": "removePlace" });
    return res.status(500).json({ error: 'Server error' })
  }
}

const allPlaces = async (req, res) => {
logger.error(`>>> Entering allPlaces(req=${req},res=${res})`, { "event.action": "allPlaces" });
  res.json(await Place.find())
logger.error(`<<< Exiting allPlaces(req=${req},res=${res})`, { "event.action": "allPlaces" });
}

const updatePlaces = async (req, res) => {
logger.error(`>>> Entering updatePlaces(req=${req},res=${res})`, { "event.action": "updatePlaces" });
  res.json(await Place.find())
logger.error(`<<< Exiting updatePlaces(req=${req},res=${res})`, { "event.action": "updatePlaces" });
}

const bookPlace = async (req, res) => {
logger.error(`>>> Entering bookPlace(req=${req},res=${res})`, { "event.action": "bookPlace" });
  const {
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    fullName,
    phone,
    price,
    meals,
    mealType,
    razorpay_payment_id,
    status
  } = req.body

  const { token } = req.cookies
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
    if (err) {
	logger.error(`<<< Exiting bookPlace(req=${req},res=${res})`, { "event.action": "bookPlace" });
      return res.json('Please Login')
    }
    const bookingDoc = await Booking.create({
      place,
      userId: currentUser.id,
      checkIn,
      checkOut,
      numberOfGuests,
      fullName,
      phone,
      price,
      meals: meals,
      mealType,
      razorpay_payment_id,
      status
    })
    return res.status(201).json({ bookingDoc })
  })
}

const cancelBooking = async (req, res) => {
logger.error(`>>> Entering cancelBooking(req=${req},res=${res})`, { "event.action": "cancelBooking" });
  try {
    // Find the booking by ID and update its status to false
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    )
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.status(200).json({
      booking: updatedBooking
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
logger.error(`<<< Exiting cancelBooking(req=${req},res=${res})`, { "event.action": "cancelBooking" });
}
const getBookingsByID = async (req, res) => {
logger.error(`>>> Entering getBookingsByID(req=${req},res=${res})`, { "event.action": "getBookingsByID" });
  const { token } = req.cookies
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
	logger.error(`<<< Exiting getBookingsByID(req=${req},res=${res})`, { "event.action": "getBookingsByID" });
    if (err) throw err
    const bookings = await Booking.find({
      userId: currentUser.id,
      status: true
    }).populate('place')

    res.json(bookings)
  })
}

const getBookingDetails = async (req, res) => {
logger.error(`>>> Entering getBookingDetails(req=${req},res=${res})`, { "event.action": "getBookingDetails" });
  console.log(req.body)
  const { token } = req.cookies
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
    if (err) throw err
    const bookings = await Booking.find().populate('place')
    console.log(bookings)
    res.json(bookings)
  })
}

const postReview = async (req, res) => {
logger.error(`>>> Entering postReview(req=${req},res=${res})`, { "event.action": "postReview" });
  const place = req.params.id
  const review = req.body.text

  const { token } = req.cookies
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, currentUser) => {
	logger.error(`<<< Exiting postReview(req=${req},res=${res})`, { "event.action": "postReview" });
    if (err) throw err

    const reviewDoc = await Review.create({
      place,
      user: currentUser.id,
      review
    })
    return res.status(201).json({ reviewDoc })
  })
}

const getReviewById = async (req, res) => {
logger.error(`>>> Entering getReviewById(req=${req},res=${res})`, { "event.action": "getReviewById" });
  const id = req.params.id
  const { token } = req.cookies
logger.error(`getReviewById(req=${req},res=${res}): id → ${id}`, { "event.action": "getReviewById" });

  const reviews = await Review.find({ place: id })
    .populate('place')
    .populate('user')

logger.error(`getReviewById(req=${req},res=${res}): reviews → ${reviews}`, { "event.action": "getReviewById" });
  res.json(reviews)

logger.error(`<<< Exiting getReviewById(req=${req},res=${res})`, { "event.action": "getReviewById" });
}
module.exports = {
  getReviewById,
  postReview,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  uploadLinkPhoto,
  addPlace,
  getPlaces,
  getSinglePlace,
  updatePlaces,
  allPlaces,
  updatePlace,
  removePlace,
  bookPlace,
  getBookingsByID,
  getBookingDetails,
  Contact,
  cancelBooking
}
