// import express from 'express'
// import {checkUserPermission} from "../middleware/userPermission.js"
// import {grantUser, revokeUser} from "../controller/userController.js"

// const router = express.Router()

// router.post('/user/grant', checkUserPermission('Granted'), grantUser) //To access by the users
// router.post('/user/revoke', checkUserPermission('Revoked'), revokeUser) //To cancle access by the users

// export default router;


import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"
import permissionMiddleware from "../middleware/permissionMiddleware.js"
import {grantPermission, revokePermission} from "../controller/userController.js"



const router = express.Router();

router.post('/grant', authMiddleware, permissionMiddleware('manage_sub_users'), grantPermission)
router.post('/revoke', authMiddleware, permissionMiddleware('manage_sub_users'), revokePermission)

export default router;