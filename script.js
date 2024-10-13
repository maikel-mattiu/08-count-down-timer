//Get HTML Elements
const inputContainer = document.querySelector("#input-container")
const countDownForm = document.querySelector("#countdown-form")
const dateElement = document.querySelector("#date-picker")
const title = document.querySelector("#countdown-title")
const countDown = document.querySelector("#countdown")
const timeElements = countDown.querySelectorAll("span")
const reset = document.querySelector("#reset")
const completeContainer = document.querySelector("#complete")
const completeInfo = document.querySelector("#complete-info")
const completeBtn = document.querySelector("#complete-button")

// Title and date
let countDownTitle = ""
let countDownDate = ""
let countDownValue = 0
let countDownInterval = null // Store interval ID
let savedCountDown = null

// Set date input to today
dateElement.setAttribute("min", new Date().toISOString().split("T")[0])

// Function to update the DOM
function toggleVisibility(hiddenElements = [], visibleElements = []) {
	hiddenElements.forEach((element) => (element.hidden = true))
	visibleElements.forEach((element) => (element.hidden = false))
}

// Function to calculate time units
function calculateTimeUnits(distance) {
	const days = Math.floor(distance / (1000 * 60 * 60 * 24))
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((distance % (1000 * 60)) / 1000)
	return { days, hours, minutes, seconds }
}

// Function to populate countdown or completion UI
function updateCountDown() {
	const now = new Date().getTime()
	const distance = countDownValue - now

	if (distance < 0) {
		toggleVisibility([countDown], [completeContainer]) // Show complete container
		clearInterval(countDownInterval) // Clear interval when countdown ends
		completeInfo.textContent = `${countDownTitle} has finished on ${countDownDate}!`
		// completeBtn.hidden = false
	} else {
		title.textContent = countDownTitle
		const { days, hours, minutes, seconds } = calculateTimeUnits(distance)
		;[days, hours, minutes, seconds].forEach(
			(value, index) => (timeElements[index].textContent = value)
		)
	}
}

// Function to handle form submission
function handleFormSubmit(event) {
	event.preventDefault()
	countDownTitle = event.target[0].value.toUpperCase()
	countDownDate = event.target[1].value
	countDownValue = new Date(countDownDate).getTime()
	// Check for valid date
	if (isNaN(countDownValue)) {
		alert("Please enter a valid date")
		return
	}
	// Save countdown to local storage
	savedCountDown = {
		title: countDownTitle,
		date: countDownDate
	}
	localStorage.setItem("countdown", JSON.stringify(savedCountDown))
	// Update UI
	toggleVisibility([inputContainer], [countDown])
	// Start countdown interval
	countDownInterval = setInterval(updateCountDown, 1000)
}

// Function to reset the countdown
function resetCountDown() {
	countDownValue = 0
	toggleVisibility([completeContainer, countDown], [inputContainer])
	countDownForm.reset()
	title.textContent = ""
	//Clear local storage
	localStorage.removeItem("countdown")
	// Clear the interval to stop updating the countdown
	clearInterval(countDownInterval)
}

// Restore countdown from local storage
function restoreCountDown() {
	const storedCountDown = localStorage.getItem("countdown")
	if (storedCountDown) {
		const { title, date } = JSON.parse(storedCountDown)
		countDownTitle = title
		countDownDate = date
		countDownValue = new Date(countDownDate).getTime()
		toggleVisibility([inputContainer], [countDown])
		countDownInterval = setInterval(updateCountDown, 1000)
	}
}

// Event Listeners
reset.addEventListener("click", resetCountDown)
completeBtn.addEventListener("click", resetCountDown) // Add event listener to reset button
countDownForm.addEventListener("submit", handleFormSubmit)
// Initialize the countdown
restoreCountDown()
