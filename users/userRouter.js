const express = require('express');
const db = require("./userDb")
const post = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  db.insert(req.body)
    .then((response) => {
      return res.status(201).json(response)
    })
    .catch((error) => {
      return res.status(500).json(error)
    })
});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {
  post.insert({ text: req.body.text, user_id: req.user.id })
    .then((response) => {
      return res.status(201).json(response)
    })
    .catch((error) => {
     return res.status(500).json(error)
    })
});

router.get('/', async (req, res) => {
  try {
    const data = await db.get()
    res.status(200).json(data)
  }
  catch(error) {
    res.status(500).json(error)
  }

});

router.get('/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', (req, res) => {
  db.getUserPosts(req.params.id)
    .then((response) => {
      return res.status(200).json(response)
    })
    .catch((error) => {
      return res.status(404).json({ message: "Not found" })
    })
});

router.delete('/:id', validateUserId(), (req, res) => {
  db.remove(req.user.id)
    .then((response) => {
      return res.status(200).json({ message: "User successfully deleted!" })
    })
    .catch((error) => {
      return res.status(500).json(error)
    })

})

router.put('/:id', validateUserId(), validateUser(), (req, res) => {
  const { name } = req.body
  db.update(req.user.id, name)
    .then((response) => {
      return res.status(200).json({ message: "User successfully edited!" })
      
    })
    .catch((error) => {
      return res.status(500).json(error)
    })

});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    db.getById(req.params.id)
      .then((user) => {
        if(user) {
          req.user = user
          next()
        } else {
          res.status(400).json({
            message: "invalid user id"
          })
        }
      })
      .catch((error) => {
        next(error)
      })
      
  }
  

}


function validateUser() {
  return (req, res, next) => {
    if(!req.body) {
      return res.status(400).json({ message: "missing user data" })
    }
    if(!req.body.name) {
      return res.status(400).json({ message: "missing required name field" })
    }
    next()
  }
}
  

function validatePost() {
  return (req, res, next) => {
    const { text } = req.body
    if(!req.body) {
      return res.status(400).json({ message: "missing post data" })
    }
    if(!text) {
      return res.status(400).json({ message: "missing required text field" })
    }
    next()
  }
}

/*`validatePost()`
  - `validatePost` validates the `body` on a request to create a new post
  - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing post data" }`
  - if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ message: "missing required text field" }`*/

module.exports = router
