export enum NMError
{
    NO_ERROR = 0,

    // Register error
    REGISTER_EXISTING_ID = 1,
    REGISTER_EXISTING_EMAIL,
    

    // Login error
    LOGIN_NOT_EXISTING_ID = 10,
    LOGIN_INCORRECT_PW,

    ETC = 100,
}