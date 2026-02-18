import { ClipLoader } from "react-spinners";

export default function FullPageLoader({ text = "Analyzing resume..." }) {
  return (
    <div style={styles.backdrop}>
      <div style={styles.loaderBox}>
        <ClipLoader color="#8b5cf6" size={80} />
        <p>{text}</p>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top:0, left:0, width:"100vw", height:"100vh",
    background:"rgba(15,23,42,0.85)",
    display:"flex", justifyContent:"center", alignItems:"center",
    zIndex: 9999
  },
  loaderBox: {
    background:"rgba(255,255,255,0.05)",
    backdropFilter:"blur(15px)",
    padding:"40px 50px",
    borderRadius:"24px",
    textAlign:"center",
    color:"#fff",
    boxShadow:"0 15px 40px rgba(0,0,0,0.5)"
  }
};