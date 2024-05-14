import React, { useEffect, useState } from 'react';
import { fetchItems } from '../control/RewardController';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth } from '../entity/fireBaseService';
import { Link } from 'react-router-dom'; // Import Link

function RewardsPage() {

  const redeemItem = async (itemId, value) => {
    try {
      const db = getFirestore();
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData.points >= value) {
        // Update points and redeemed items
        await updateDoc(userDocRef, {
          points: userData.points - value,
          redeemedItems: arrayUnion(itemId)
        });
        alert("Item redeemed successfully!");
      } else {
        alert("Not enough points to redeem the item.");
      }
    } catch (error) {
      console.error("Error redeeming item:", error);
      alert("There was an error redeeming the item.");
    }
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const itemsList = await fetchItems();
        setItems(itemsList);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    };

    getItems();
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '0 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '40px',
  };

  const tableContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const thStyle = {
    backgroundColor: '#6a5acd',
    color: '#ffffff',
    padding: '10px',
    textAlign: 'center',
  };

  const tdStyle = {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ddd',
  };

  const logoStyle = {
    alignSelf: 'flex-start',
    maxWidth: '80px',
    padding: '20px',
    marginTop: '-50px',
  };

  const navStyle = {
    alignSelf: 'flex-start',
    paddingLeft: '20px',
    marginBottom: '40px',
    display: 'flex',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#6a5acd',
    margin: '0 10px',
  };

  const buttonStyle = {
    padding: '5px 10px',
    backgroundColor: '#6a5acd',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>

      <nav style={navStyle}>
        <img src="/logo.png" alt="Logo" style={logoStyle} />
        <div>
          <Link to="/home" style={navLinkStyle}>Home</Link>
          <Link to="/rewards" style={navLinkStyle}>Rewards</Link>
          <Link to="/manage" style={navLinkStyle}>Profile</Link>
        </div>
      </nav>
      <div style={headerStyle}>Rewards List</div>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Item Description</th>
              <th style={thStyle}>Value</th>
              <th style={thStyle}>Redeem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.id}</td>
                <td style={tdStyle}>{item.Description}</td>
                <td style={tdStyle}>{item.Value}</td>
                <td style={tdStyle}>
                <button
                    style={buttonStyle}
                    onClick={() => redeemItem(item.id, item.Value)}
                  >
                    Redeem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RewardsPage;