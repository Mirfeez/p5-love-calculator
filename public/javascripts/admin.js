function checkPassword() {
	const password = document.getElementById("adminPassword").value;

	fetch("/admin-login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ password }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				alert("Welcome, Admin 👨‍💻 Access Granted.");

				document.getElementById("loginScreen").classList.add("hidden");
				document.getElementById("dashboard").classList.remove("hidden");
			} else {
				document.getElementById("loginError").textContent =
					"Wrong password";
			}
		});
}

function getScoreColor(score) {
	if (score <= 20) return "bg-red-500";
	if (score <= 40) return "bg-orange-500";
	if (score <= 60) return "bg-yellow-500";
	if (score <= 80) return "bg-green-500";
	return "bg-blue-500";
}

function addRow(id, dateTime, him, her, score) {
	const tableBody = document.getElementById("tableBody");
	const colorClass = getScoreColor(score);

	const row = `
      <tr id="row-${id}" class="hover:bg-zinc-700 transition">
      <td class="px-6 py-4">${dateTime}</td>
      <td class="px-6 py-4 font-medium text-white">${him}</td>
      <td class="px-6 py-4 font-medium text-white">${her}</td>
      <td class="px-6 py-4 text-center">
         <span class="${colorClass} text-white px-3 py-1 rounded-full text-xs">
            ${score}%
         </span>
      </td>
      <td class="px-6 py-4 text-center">
            <button onclick="deleteResult('${id}')" 
            class="bg-black border hover:shadow hover:shadow-red-500 hover:bg-red-700 hover:border-transparent px-3 py-1 rounded text-xs">
            Delete
            </button>
      </td>
      </tr>
   `;

	tableBody.innerHTML += row;
}

function deleteResult(id) {
	if (!confirm(`Are you sure you want to delete this record of row-${id}`))
		return;

	fetch(`/delete-result/${id}`, {
		method: "DELETE",
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				document.getElementById(`row-${id}`).remove();
			}
		})
		.catch((err) => console.log(err));
}


fetch("/admin-data")
	.then((res) => res.json())
	.then((data) => {
		data.forEach((item) => {
			addRow(
				item._id,
				new Date(item.createdAt).toLocaleString(),
				item.hisName,
				item.herName,
				item.score,
			);
		});
	});

