export const getAllUniqueDays = (appointments) => {
	const allDates = appointments.map((appointment) => appointment.dateString);

	return allDates.filter((date, index, self) => self.indexOf(date) === index);
};

export const getAppointmentsPerUniqueDay = (uniqueDays, appointments) => {
	let appointmentsPerUniqueDay = new Object();
	uniqueDays.forEach((day) => {
		const thisDaysAppointments = appointments.filter(
			(appointment) => appointment.dateString === day
		);
		appointmentsPerUniqueDay[day] = thisDaysAppointments;
	});
	return appointmentsPerUniqueDay;
};

export const getAppointmentsGroupedOrderedByQuantity = (
	allAppointmentsByLocation
) => {
	const allAppointmentsByLocationKeys = Object.keys(allAppointmentsByLocation);

	// sorts the list of locations by how many appointments (array length) in total are available
	allAppointmentsByLocationKeys.sort(
		(a, b) =>
			allAppointmentsByLocation[b].length - allAppointmentsByLocation[a].length
	);

	// using the index of the property, remaking into an object, sorted by quantity
	return allAppointmentsByLocationKeys.reduce((obj, key, index) => {
		obj[index + "_" + key] = allAppointmentsByLocation[key];
		return obj;
	}, {});
};
