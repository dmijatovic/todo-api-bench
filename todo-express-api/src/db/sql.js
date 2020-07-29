import pgdb from './pgdb'

const UserReturningFields=`id,roles,first_name,last_name,email,birth_date,createdate`

export function getUserByEmail(email:string){
  return pgdb.query("SELECT * FROM users WHERE email=$1 LIMIT 1;",[email])
    .then(resp =>{
      // console.log("psql resp...", resp)
      if (resp.rowCount===1){
        const user:iUser = resp.rows[0]
        // console.log("psql user...", user)
        return user
      }else{
        throw Error("User not found!")
      }
    })
    .catch(e=>{
      // console.log(e)
      throw e
    })
}

export function addUser(user:iUser){
  // encript password
  user['password'] = hashValueSync(user['password'])
  // add new user
  return pgdb.query(`INSERT INTO users
    (roles,first_name,last_name,email,password,birth_date)
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${UserReturningFields};`,
    [
      user.roles, user.first_name,user.last_name,
      user.email,user.password,user.birth_date
    ]).then(resp=>{
      // console.log("addNewUser.resp...", resp)
      if (resp.rowCount===1){
        return resp.rows[0]
      }else{
        throw new Error("Failed to add user")
      }
    })
    .catch(e=>{
      throw e
    })
}

export function updateUser(user:iUser){
  // console.log("updateUser...", user)
  return pgdb.query(`UPDATE users SET roles=$2,
    first_name=$3,last_name=$4,birth_date=$5
    WHERE id=$1
    RETURNING ${UserReturningFields};`,
    [
      user.id,user.roles,user.first_name,
      user.last_name,user.birth_date
    ]).then(resp=>{
      // console.log("addNewUser.resp...", resp)
      if (resp.rowCount===1){
        return resp.rows[0]
      }else{
        throw new Error("Failed to update user")
      }
    })
    .catch(e=>{
      throw e
    })
}

export function deleteUserById(id:string){
  return pgdb.query(`DELETE FROM users
    WHERE id=$1
    RETURNING ${UserReturningFields};`,[id])
    .then(resp=>{
      // console.log("addNewUser.resp...", resp)
      if (resp.rowCount===1){
        return resp.rows[0]
      }else{
        throw new Error("Failed to update user")
      }
    })
    .catch(e=>{
      throw e
    })
}

export function allUsers(){
  return pgdb.query(`SELECT ${UserReturningFields} FROM users;`)
    .then(resp =>{
      // console.log("psql resp...", resp)
      if (resp.rowCount > 0){
        return resp.rows
      }else{
        return []
      }
    })
    .catch(e=>{
      // console.log(e)
      throw e
    })
}


export function extractUserProfileFromUser(user:iUser):iUserProfile{
  let userProfile={
    ...user
  }
  delete userProfile['password']
  return userProfile
}