exports.isNotValid = isNotValid={
    username:false,
    email:false
};


exports.userValidationUsername = ()=>{
    isNotValid.username = true;
    setTimeout(()=>{
        isNotValid.username =false;
    }, 200)
};

exports.userValidationEmail = ()=>{
    isNotValid.email = true;
    setTimeout(()=>{
        isNotValid.email =false;
    }, 200)
};

