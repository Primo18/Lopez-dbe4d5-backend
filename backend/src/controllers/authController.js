import authService from '../services/authService.js';

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await authService.register({ username, email, password });
    res.status(201).json(user);
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const token = await authService.login({ email, password });
    res.status(200).json({ token });
};

export default { register, login };
