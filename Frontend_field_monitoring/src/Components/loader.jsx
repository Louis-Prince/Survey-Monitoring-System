// import '../CSS/loader.css';

// const Loader = ({ size = 40 }) => {
//   return (
//     <div className="loader-container">
//       <div className="spinner" style={{ width: size, height: size }} />
//     </div>
//   );
// };

// export default Loader;
import '../CSS/loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader" />
    </div>
  );
};

export default Loader;

// import '../CSS/loader.css';

// const Loader = () => {
//   return (
//     <div className="loader-wrapper">
//       <div className="loader" />
//     </div>
//   );
// };

// export default Loader;
