import axios from 'axios';

export const checkAuth = async (setAuth) => {
  try {
    let res = await axios.get('http://localhost:5000/user', {
      withCredentials: true,
    });
    if (res.data.id) {
      const userId = res.data.id;
      const userName = res.data.name;
      console.log('111111', userId, userName, res);
      setAuth({ isAuth: true, userId, userName });
      return;
    }
    setAuth({ isAuth: false });
  } catch (error) {
    console.error(error);
  }
};
