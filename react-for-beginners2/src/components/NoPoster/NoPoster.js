import PropTypes from "prop-types";
import styles from "./NoPoster.module.css";

function NoPoster({ title, className }) {
  return (
    <div className={`${styles.noImage} ${className || ""}`}>
      <span>{title}</span>
    </div>
  );
}

NoPoster.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default NoPoster;
