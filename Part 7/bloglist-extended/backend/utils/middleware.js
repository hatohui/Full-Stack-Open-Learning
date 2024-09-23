const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', "")
    } else {
        request.token = null
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    if (!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
    } 

    request.user = await User.findById(decodedToken.id);
    next()
}

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('------')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({
            error: 'invalid ID'
        })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: error.message
        })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({
            error: 'expected `username` to be unique'
        })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'token invalid'
        })
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

module.exports = {
    tokenExtractor,
    userExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler
}