import admin from "./../../firebase"

export function post(req, res, next) {
    res.clearCookie('__session');
    res.json({ "say": "Hey you are logged out ;) bye" })
}