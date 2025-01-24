import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Profile/PersonalInformation.scss';

const PersonalInformation = ({ user, isGuest }) => {
  if (!user && !isGuest) {
    return <div className="no-user-info">No user information available</div>;
  }

  return (
    <div className="personal-information">
      <h2 className="section-title">Personal Information</h2>
      <div className="info-card">
        <div className="info-item">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <div className="info-content">
            <span className="label">First Name</span>
            <span className="value">{user?.first_name || 'Not provided'}</span>
          </div>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <div className="info-content">
            <span className="label">Last Name</span>
            <span className="value">{user?.last_name || 'Not provided'}</span>
          </div>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <div className="info-content">
            <span className="label">Email</span>
            <span className="value">{user?.email || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;