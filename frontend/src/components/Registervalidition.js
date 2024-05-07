function validation(values) {
    let error = {}
    const empnumber_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.empnumber === "") {
        error.empnumber = "工號不可為空"
    }
    else {
        error.empnumber = ""
    }

    if(values.password === "") {
        error.password = "密碼不可為空"
    }
    else if (!password_pattern.test(values.password)) {
        error.password = "密碼不正確"
    } else {
        error.password = ""
    }
    return error;
}

export default validation;