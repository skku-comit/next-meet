export enum NM_CODE
{
    NO_ERROR = 0,

    // Register error
    REGISTER_EXISTING_ID = 1,
    REGISTER_EXISTING_EMAIL,
    REGISTER_EXISTING_ACCOUNT, //for social login
    REGISTER_SHORT_ID,
    REGISTER_SHORT_NAME,
    REGISTER_SHORT_PW,
    REGISTER_BAD_EMAIL,
    REGISTER_INCONSISTENT_PW,

    REGISTER_SUCCESS = 19,


    // Login error
    LOGIN_FAILED = 10,
    LOGIN_MISSING_ID,
    LOGIN_MISSING_PW,


    // Search result
    SEARCH_EXISTING_ID = 20,
    SEARCH_EXISTING_EMAIL,
    SEARCH_EXISTING_ACCOUNT,

    //etc
    INTERNAL_SERVER_ERROR = 99,
    ETC 
}

export const NM_MSG_KOR = {
    0: '',

    1: '동일한 아이디가 존재합니다.',
    2: '동일한 이메일이 존재합니다.',
    3: '이미 가입된 계정입니다.',
    4: '아이디가 너무 짧습니다.',
    5: '이름이 너무 짧습니다.',
    6: '비밀번호가 너무 짧습니다.',
    7: '유효하지 않은 이메일입니다.',
    8: '비밀번호가 일치하지 않습니다.',
    
    10: '아이디 또는 비밀번호가 틀렸습니다.',
    11: '아이디를 입력해주세요.',
    12: '비밀번호를 입력해주세요.',
    
    19: '회원가입이 완료되었습니다.',

    20: '이미 존재하는 아이디입니다.',
    21: '이미 존재하는 이메일입니다.',
    22: '이미 존재하는 계정입니다.',
    
    99: '내부 서버 오류가 발생했습니다.',
    100:'',
}

export const NM_MSG_ENG = {
    0: '',
    1: 'The ID already exists.',
    2: 'The email already exists.',
    3: 'The account is already registered.',
    4: 'The ID is too short.',
    5: 'The name is too short.',
    6: 'The password is too short.',
    7: 'Invalid email.',
    8: 'Passwords do not match.',
    
    10: 'ID or password incorrect.',
    11: 'Please enter your ID.',
    12: 'Please enter your password.',

    19: 'Successfully Registered!',
    
    20: 'Existing ID.',
    21: 'Existing email.',
    22: 'Existing account.',
    
    99: 'Internal server error occurred.',
    100:'',
}
