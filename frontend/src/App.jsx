import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <>
      
      <ToastContainer autoClose={1000} />
    <Outlet/>
    </>
  );
};

export default App;