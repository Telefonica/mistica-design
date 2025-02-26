// This file defines the `CreateColor` component, the first step in the skin creation flow. 
// It allows users to define a color palette for their brand using color pickers, persists selections in localStorage, and provides navigation to other steps.

import {
	ResponsiveLayout, 
	TextLink, 
	skinVars, 
	ButtonPrimary, 
	ButtonSecondary, 
	Text6,
	Text2,
	ProgressBarStepped,
	IconLayersRegular,
	Text1,
  } from "@telefonica/mistica";
  import React, { useState, useEffect } from 'react';
  import './create-color.css';
  import { useNavigate } from "react-router-dom";
  import { useLocation } from 'react-router-dom';
  
  // Initilal color palette with empty values
  const initialColors = {
	brandColor: '',
	successColor: '',
	errorColor: '',
	warningColor: '',
	promoColor: '',
	neutral1: '',
	neutral2: '',
	neutral3: '',
  };
  
  const CreateColor = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isCreateSkinPage = location.pathname === '/create-skin';
  
	// State to manage the color palette, initialized from localStorage or initialColors
	const [colors, setColors] = useState(() => {
	  const storedColors = localStorage.getItem("skinColors");
	  return storedColors ? JSON.parse(storedColors) : initialColors;
	});
	
	// Effect hook to persist color changes in localStorage
	useEffect(() => {
	  localStorage.setItem("skinColors", JSON.stringify(colors));
	}, [colors]);
  
	// Function to update a specific color in the palette
	const handleColorChange = (key, value) => {
	  setColors((prevColors) => ({
		...prevColors,
		[key]: value,
	  }));
	};
  
	// Function to reset all the colors to their initial empty state
	const handleResetColors = () => {
	  setColors(initialColors);
	  localStorage.setItem('userColors', JSON.stringify(initialColors));
	};
  
	// Component to render a single color picker box
	const ColorBox = ({ colorKey, label }) => (
	  <span className="each-color" id={colorKey}>
		<div
		  className="color-preview"
		  style={{
			backgroundColor: colors[colorKey] || '#FFFFFF',
			border: `2px solid ${skinVars.colors.border}`,
		  }}
		  onClick={() => document.getElementById(`${colorKey}-input`).click()}
		>
		  {!colors[colorKey] && <IconLayersRegular size={40} color={skinVars.colors.border}/>}
		</div>
		<input
		  id={`${colorKey}-input`}
		  type="color"
		  value={colors[colorKey] || '#FFFFFF'}
		  onChange={(e) => handleColorChange(colorKey, e.target.value)}
		  style={{
			position: 'absolute',
			visibility: 'hidden',
		  }}
		/>
		<span className="text">
		  <Text2 weight="medium">{label}</Text2>
		  {colors[colorKey] ? (
			<Text1 color={skinVars.colors.textSecondary}>
			  {colors[colorKey].toUpperCase()}
			</Text1>
		  ) : (
			<TextLink onPress={() => document.getElementById(`${colorKey}-input`).click()}>
			  Definir color
			</TextLink>
		  )}
		</span>
	  </span>
	);
  
	return (
	  <ResponsiveLayout>
		<div className="header">
		  <p>loguito</p>
		  <div className="progress-bar">
			<ProgressBarStepped steps="4" currentStep="1" />
		  </div>
		  <Text2 color={skinVars.colors.textSecondary}>Step 1 of 4</Text2>
		</div>
  
		<div className="title-section">
		  <IconLayersRegular size={40} />
		  <Text6>Build Your Brand's Palette</Text6>
		  <Text2 color={skinVars.colors.textSecondary}>
			Choose the colors that will define your Mística Skin.
		  </Text2>
		</div>
  
		<div className={`color-card ${isCreateSkinPage ? 'wide' : 'equal'}`}>
		  <div className="primary-child">
			<ColorBox colorKey="brandColor" label="Brand" />
		  </div>
		  <div className="right-col">
			<div className="secondary-child">
			  <ColorBox colorKey="successColor" label="Success" />
			  <ColorBox colorKey="errorColor" label="Error" />
			  <ColorBox colorKey="warningColor" label="Warning" />
			  <ColorBox colorKey="promoColor" label="Promo" />
			</div>
			<div className="neutral-child">
			  <ColorBox colorKey="neutral1" label="Neutral 1" />
			  <ColorBox colorKey="neutral2" label="Neutral 2" />
			  <ColorBox colorKey="neutral3" label="Neutral 3" />
			</div>
		  </div>
		</div>
		
		<div className="buttons">
		  <ButtonSecondary onPress={() => navigate('/skin-tool')}>Back</ButtonSecondary>
		  <ButtonSecondary onPress={handleResetColors}>Restaurar valores</ButtonSecondary>
		  <ButtonPrimary onPress={() => navigate('/create-typo')}>Next step: Typography</ButtonPrimary>
		</div>
	  </ResponsiveLayout>
	);
  };
  
  export default CreateColor;