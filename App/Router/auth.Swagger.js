/**
 * @swagger 
 *  components:
 *      schemas: 
 *          GetOTP:
 *              type: object
 *              required: 
 *                  -   mobile
 *              properties: 
 *                  mobile: 
 *                      type: string
 *                      description: the user mobile for signUp/signIn
 *          checkOTP: 
 *              type: object
 *              required: 
 *                  -   mobile
 *                  -   code    
 *              properties: 
 *                  mobile:
 *                      type: string
 *                      description: the user mobile for signUp/signIn
 *                  code:   
 *                      type: integer
 *                      description: received code from getOTP
 *          RefreshToken:
 *              type: object
 *              required: 
 *                  -   refreshToken
 *              properties: 
 *                  refreshToken: 
 *                      type: string
 *                      description: enter refresh token for get 
 */

/**
 * @swagger 
 *  /user/get-otp: 
 *              post: 
 *                  tags: [User-Authentication]
 *                  summary: get-otp User In User Panel with PhoneNumber
 *                  description: One Time Password (OTP) get-otp
 *                  requestBody:
 *                      required: true
 *                      content: 
 *                          application/x-www-form-urlencoded:
 *                              schema: 
 *                                  $ref: '#/components/schemas/GetOTP'
 *                          application/json:
 *                              schema: 
 *                                  $ref: '#/components/schemas/GetOTP'
 *                  responses:
 *                            201 : 
 *                               description: Success
 *                            400 : 
 *                               description: bad Request 
 *                            401: 
 *                               description: UnAuthorization
 *                            500: 
 *                               description: Internal Server Error 
 */

 /**
 * @swagger 
 *  /user/check-otp:
 *                  post: 
 *                      tags: [User-Authentication]
 *                      summary: check-otp value In User controller
 *                      description: check-otp with code - mobile and expire date
 *                      requestBody:
 *                          required: true
 *                          content: 
 *                              application/x-www-form-urlencoded:
 *                                  schema: 
 *                                      $ref: '#/components/schemas/checkOTP'
 *                              application/json:
 *                                  schema: 
 *                                      $ref: '#/components/schemas/checkOTP'
 *                      responses:
 *                            201 : 
 *                               description: Success
 *                            400 : 
 *                               description: bad Request 
 *                            401: 
 *                               description: UnAuthorization
 *                            500: 
 *                               description: Internal Server Error 
 */

 /**
 *@swagger
 *  /user/refresh-token:
 *      post:
 *          tags: [User-Authentication]
 *          summary: send refresh token
 *          description: refresh token  
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/x-www-form-urlencoded:
 *                      schema: 
 *                          $ref: '#/components/schemas/RefreshToken'
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/RefreshToken'
 *          responses: 
 *                  200: 
 *                      description: success
 */