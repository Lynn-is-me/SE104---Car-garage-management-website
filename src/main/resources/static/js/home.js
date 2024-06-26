var test;

// Menu handler
document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId),
        menuOpen = document.getElementById("menu-open");
    menuClose = document.getElementById("menu-close");

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd && menuOpen && menuClose) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show-nav");

        // change icon
        if (menuOpen.classList.contains("show")) {
          menuOpen.classList.remove("show");
          menuOpen.classList.add("hidden");
          menuClose.classList.remove("hidden");
          menuClose.classList.add("show");
        } else {
          menuOpen.classList.remove("hidden");
          menuOpen.classList.add("show");
          menuClose.classList.remove("show");
          menuClose.classList.add("hidden");
        }

        // add padding to body
        bodypd.classList.toggle("body-pd");

        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  }
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }

  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  // click event Menu => change html direction
  // $("#orderMenu").click(function () {
  //   window.location.href = 'home.html';
  // });
  //
  // $("#vehicleMenu").click(function () {
  //   window.location.href = 'vehicle.html';
  // });
});

async function deleteForm1(vehicleLicensePlate) {
  try {
    const test = await $.ajax({
      url: `/delete-row-form1?license_plate=${vehicleLicensePlate}`,
      method: 'DELETE',
      dataType: 'json'
    });
    return test;
  } catch (error) {
    alert(error);
  }
}

async function callAPIChangeForm1(oldPhoneNumber, newData, type) {
  let name = null;
  let phoneNumber = null;
  let email = null;
  let address = null;

  let dataObject = {
    name: name,
    phoneNumber: phoneNumber,
    email: email,
    address: address,
    oldPhoneNumber: oldPhoneNumber
  };

  if (type === "email") {
    dataObject.email = newData;
  }
  if (type === "phone") {
    dataObject.phoneNumber = newData;
  }
  if (type === "name") {
    dataObject.name = newData;
  }
  if (type === "address") {
    dataObject.address = newData;
  }

  $.ajax({
    url: '/change-form1',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(dataObject),
    success: function(response) {
      // alert(response.status);
    },
    error: function(xhr, status, error) {
      alert(error)
    }
  });
}

async function fetchData() {
  try {
    test = await $.ajax({
      url: "/get-all-records",
      method: "GET",
      dataType: "json",
    });
    console.log(test);
    checkLicensePlate();


    // Sort table function
    $("th").on("click", function () {
      var column = $(this).data("column");
      var order = $(this).data("order");
      var text = $(this).html();
      if (order !== undefined) {
        text = text.substring(0, text.length - 1);
        if (order == "desc") {
          $(this).data("order", "asc");
          test = test.sort((a, b) => (a[column] > b[column] ? 1 : -1));
          text += "&#9660";
        } else if (order == "asc") {
          $(this).data("order", "desc");
          test = test.sort((a, b) => (a[column] < b[column] ? 1 : -1));
          text += "&#9650";
        }
      } else text = text;
      $(this).html(text);
      buildTable(test);
    });

    document.getElementById("addDate").addEventListener("input", function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }

      var currentDay = new Date();
      currentDay.setHours(0, 0, 0, 0);

      var typedDay = new Date(this.value);
      typedDay.setHours(0, 0, 0, 0);

      if (typedDay < currentDay) {
        popupDialog(
            "Error",
            "Your typed day must greater than current day !!!"
        );
        this.value = "";
      }
    });

    // Search function
    $("#search-input").on("keyup", function () {
      var value = $(this).val();
      console.log("Value", value);
      //// get Table Data from database
      // tableData = getDataFromServer()
      // var data = searchTable(value, tableData)
      var data = searchTable(value, test);
      buildTable(data);
    });

    function searchTable(value, data) {
      var filteredData = [];
      for (var i = 0; i < data.length; i++) {
        value = value.toLowerCase();
        var name = data[i].Name.toLowerCase();
        if (name.includes(value)) {
          console.log("index of data: ", i);
          filteredData.push(data[i]);
        }
      }
      return filteredData;
    }

    function getDataFromServer() {
      $.ajax({
        method: "GET",
        url: "/data", // Thay thế đường dẫn với URL của dữ liệu JSON trên máy chủ của bạn
        dataType: "json",
        success: function (response) {
          // Xử lý dữ liệu JSON được nhận từ máy chủ ở đây
          console.log("Data from server:", response);
          return response;
        },
        error: function (xhr, status, error) {
          console.error("Error fetching data:", error);
        },
      });
    }

    // Build Table function
    // Build Table function
    function buttonEvent() {
      // Gỡ bỏ sự kiện click trước khi gán lại
      $('.details-button[data-vehicle-license-number]').off('click').on('click', function() {
        detailsData.call(this);
      });

      $('.delete-button[data-vehicle-license-number]').off('click').on('click', deleteData);

      $('.confirm-button[data-vehicle-license-number]').off('click').on('click', function() {
        confirmDeletion.call(this);
      });

      // $('.cancel-button[data-vehicle-license-number]').off('click').on('click', cancelDeletion);
      $('[id^="data-"]').off('click').on('click', function(){
        editDataForm1.call(this);
      })
    }


    function addRow(data){
      var numOrders = data.Cars.length
      // console.log(numOrders)
      // console.log(`${data.ID}`)
      var row = `<tr scope="row" class="data-row-${data.ID}" data-id=${data.ID}>
            <td rowspan="${numOrders}" id="data-name-${data.ID}" data-toggle="tooltip" title="click for edit">${data.Name}</td>
            <td rowspan="${numOrders}" id="data-phone-${data.ID}" data-toggle="tooltip" title="click for edit">${data.Phone}</td>
            <td rowspan="${numOrders}" id="data-email-${data.ID}" data-toggle="tooltip" title="click for edit">${data.Email}</td>
            <td rowspan="${numOrders}" id="data-address-${data.ID}" data-toggle="tooltip" title="click for edit">${data.Address}</td>
            <td id=data-order-brand-${data.Cars[0].licenseNumber}>${data.Cars[0].brand}</td>
            <td id=data-order-num-${data.Cars[0].licenseNumber}>${data.Cars[0].licenseNumber}</td>
            <td>
                 <div class = "row col-sm-2 show" id = "change-del-btn-${data.Cars[0].licenseNumber}">
                     <span style="cursor: pointer; color:green"  class="material-symbols-outlined details-button" data-id"="${data.ID}" data-vehicle-license-number="${data.Cars[0].licenseNumber}" data-toggle="tooltip" title="click for details">info</span>
                     <span style="cursor: pointer; color:red" class="material-symbols-outlined delete-button" data-id="${data.ID}" data-vehicle-license-number="${data.Cars[0].licenseNumber}" data-toggle="tooltip" title="click for delete">delete</span>
                 </div>
              </td>`;

      $('#myTable').append(row)
      buttonEvent(data.Cars[0].licenseNumber, data.ID)

      row =''
      for (var i = 1; i < numOrders; i++) {
        var subRow = `
            <tr>
                <td id=data-order-brand-${data.Cars[i].licenseNumber}>${data.Cars[i].brand}</td>
                <td id=data-order-num-${data.Cars[i].licenseNumber}>${data.Cars[i].licenseNumber}</td>
                <td>
                    <div class = "row col-sm-2 show" id = "change-del-btn-${data.Cars[i].licenseNumber}">
                        <span style="cursor: pointer; color:green"  class="material-symbols-outlined details-button" data-id"="${data.ID}" data-vehicle-license-number="${data.Cars[i].licenseNumber}" data-toggle="tooltip" title="click for details">info</span>
                        <span style="cursor: pointer; color:red" class="material-symbols-outlined delete-button" data-id="${data.ID}" data-vehicle-license-number="${data.Cars[i].licenseNumber}" data-toggle="tooltip" title="click for delete">delete</span>
                      </div> 
                </td>
            </tr>`
        $('#myTable').append(subRow)
        buttonEvent(data.Cars[i].licenseNumber, data.ID)
      }
    }

    function buildTable(data) {
      console.log("build table called")
      var table = document.getElementById('myTable')
      table.innerHTML = ''
      for (var i in data) {
        // console.log(data[i])
        addRow(data[i])
      }
    }

    buildTable(test);

    // ----------------- edit form1 function
    function getID(id){
      var idArray = id.split("-");
      return idArray[idArray.length - 1];
    }
    function getPhoneNumber(dataID) {
      var phoneNumber = "";

      $('table tr').each(function() {
        var phoneCell = $(this).find(`td[id^="data-phone-${dataID}"]`);
        if (phoneCell.length > 0) {
          phoneNumber = phoneCell.text();
          return false;
        }
      });
      return phoneNumber;
    }
    function editDataForm1(){
      var dataID =  $(this).attr('id')
      var rowID = getID(dataID)
      console.log(rowID)
      var oldPhone = getPhoneNumber(rowID)
      console.log(oldPhone)
      if (dataID.includes('data-order-')){
        return ;
      }
      var currentData = $(this).text()
      var inputElement = $('<input type="text" class="form-control">').val(currentData)
      $(this).empty().append(inputElement);
      inputElement.focus();
      var beforeInput = currentData
      // console.log("before", beforeInput)
      var originalElement = $(this);
      inputElement.blur(function() {
        var newData = $(this).val();
        $(this).parent().text(newData);

        if (newData !== currentData) {
          Swal.fire({
            title: 'Changes Confirmation',
            text: 'Are you sure to save these changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.isConfirmed) {
              // console.log("old Phone, new Data: ", oldPhone, newData)
              let type = null;
              if (dataID.toString().includes("email")) {
                type = "email";
              }
              if (dataID.toString().includes("name")) {
                type = "name";
              }
              if (dataID.toString().includes("phone")) {
                type = "phone";
              }
              if (dataID.toString().includes("address")) {
                type = "address";
              }
              callAPIChangeForm1(oldPhone, newData, type);

              setTimeout(function () {
                Swal.fire('Success', 'Changes saved', 'success');
              }, 3000);

              window.location.reload();

            } else {
              // console.log("after", beforeInput)
              originalElement.text(beforeInput)
            }
          });
        }
      });

      $(`input`).on('keyup', function(event) {
        if (event.keyCode === 13) {
          $(this).blur();
        }
      });

      // call api change data
    }

    //Add data functions
    // ------------------ Form Appear after click add button
    $('#addData').on('click', function () {
      $('#formAdd').addClass('show');
      $('#dataTable').css({
        'opacity': '0.5',
        'pointer-events': 'none'
      });
      var currForm = 1;

      function showForm(formNum) {
        console.log("currform", formNum)
        $(".formAdd").addClass("hidden");
        $(".formAdd").removeClass("show");
        $("#formAdd-" + formNum).removeClass("hidden");
        $("#formAdd-" + formNum).addClass("show");
      }

      $(".moveRight").click(function () {
        if (currForm < $(".formAdd").length) {
          currForm++;
          showForm(currForm);
        }
      });
      $(".moveLeft").click(function () {
        if (currForm > 1) {
          currForm--;
          showForm(currForm);
        }
      });
    });

    function closeForm(idForm, idClose, tableBackground, event) {
      // ---Example use:
      // closeForm('#formAdd_1', '#closeForm_1', '#dataTable', 'click');
      $(idClose).on(event, function () {
        $(idForm).addClass('hidden');
        $(idForm).removeClass('show');
        // $('body').css('overflow', 'auto');
        $(tableBackground).css({
          'opacity': '',
          'pointer-events': ''
        });
      });
    }

    closeForm('#formAdd', '#closeForm_1', '#dataTable', 'click');


    // Delete data fucntion
    // ---------------- Delete data fucntion
    function deleteData() {
      var vehicleID = $(this).attr('data-vehicle-license-number');

      if (vehicleID) {
        Swal.fire({
          title: 'Delete Confirmation',
          text: 'Are you sure to delete this data?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            if (confirmDeletion(vehicleID))
              Swal.fire('Success', 'Deleted ', 'success');
            setTimeout(function () {
              console.log("Waiting 5 seconds")
              window.location.reload();
            }, 3000);
          } else
            Swal.fire('Cancel', 'Cancel Deletion', 'info')
        });
      } else {
        console.log("vehicleID is undefined or empty");
      }
    }

    async function confirmDeletion(vehicleID) {
      console.log(vehicleID)
      // var vehicleID = $(this).data('vehicle-license-number')
      let response = await deleteForm1(vehicleID);
      // return !!response.success;
      if (response.success)
          return true;
      else
        return false;
    }

    // ------------ FORM 2 ---------------

    // Right Table
    function addRowDetails(data) {
      let numVehicle = 0;

      // Tính tổng số lượng chi tiết
      data.Dates.forEach(function(date) {
        numVehicle += date.Details.length;
      });

      data.Dates.forEach(function(dateData, dateIndex) {
        dateData.Details.forEach(function(detail, detailIndex) {
          var orderNumber = detail.OrderNumber;
          var row = '';
          if (detailIndex === 0) {
            row += `<tr>`;
            if (dateIndex === 0)
              row += `<td id="data-order-num-${data.licenseNumber}" rowspan="${numVehicle}">${data.licenseNumber}</td>`;
            row += `<td id="data-order-date-${data.Dates.length}" rowspan="${data.Dates.length}">${dateData.Date}</td>`;
          }
          row += `<td data-order-id="${orderNumber}" id="data-order-note-${orderNumber}" data-toggle="tooltip" title="click for edit">${detail.notes}</td>
                        <td data-order-id="${orderNumber}" id="data-order-equip-${orderNumber}" data-toggle="tooltip" title="click for edit">${detail.equip}</td>
                        <td data-order-id="${orderNumber}" id="data-order-quantity-${orderNumber}" data-toggle="tooltip" title="click for edit">${detail.quantity}</td>
                        <td data-order-id="${orderNumber}" id="data-order-price-${orderNumber}" data-toggle="tooltip" title="click for edit">${detail.price}</td>
                        <td data-order-id="${orderNumber}" id="data-order-charge-${orderNumber}" data-toggle="tooltip" title="click for edit">${detail.charge}</td>
                        <td data-order-id="${orderNumber}" id="data-order-total-${orderNumber}" data-toggle="tooltip" title="click for edit">${detail.total}</td>
                        <td>
                            <span style="cursor: pointer; color:red" class="material-symbols-outlined delete-button" data-order="${detail.OrderNumber}" data-vehicle-license-number="${data.licenseNumber}" data-toggle="tooltip" title="click for delete">delete</span>
                        </td>
                    </tr>`;

          $('#detailsTable').append(row);
          $('.delete-button[data-order-]').off('click').on('click', function(){
            deleteDetails.call(this)
          })
          $('[id^="data-order-"]').off('click').on('click', function(){
            editDataDetails.call(this);
          })
        })
      });
    }
    function detailsData() {
      $(`#detailsTable`).empty()
      var vehicleID = $(this).data('vehicle-license-number');
      console.log(vehicleID);

      var firstData = {
        "licenseNumber": vehicleID,
        "Dates": [{
          'Date': '01/05/2024',
          'Details': [{
            'OrderNumber':'1',
            'notes': 'aaaa',
            'equip': 'wheels',
            'quantity': '2',
            'price': '10',
            'charge': '4',
            'total': '24'
          },
            {
              'OrderNumber':'2',
              'notes': 'bbbbb',
              'equip': 'big wheels',
              'quantity': '2',
              'price': '20',
              'charge': '4',
              'total': '24'
            }
          ]
        },
          {
            'Date': '1/1/2005',
            'Details': [{
              'OrderNumber':'3',
              'notes': 'bbbbb',
              'equip': 'small wheels',
              'quantity': '2',
              'price': '8',
              'charge': '4',
              'total': '24'
            },
              {
                'OrderNumber':'4',
                'notes': 'bbbbb',
                'equip': 'big glass',
                'quantity': '2',
                'price': '10',
                'charge': '4',
                'total': '24'
              }
            ]
          }
        ]
      };

      closeForm('#formDetails', '#closeForm', '#dataTable', 'click');
      $('#formDetails').addClass('show').removeClass('hidden');
      $('#dataTable').css({
        'opacity': '0.5',
        'pointer-events': 'none'
      });

      addRowDetails(firstData);
    }
    function deleteDetails(){
      var orderID = $(this).data('order-id')
      console.log(orderID)
      if (orderID){
        Swal.fire({
          title: 'Delete Confirmation',
          text: 'Are you sure to delete this data?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            if (confirmDeletionDetails(vehicleID))
              Swal.fire('Success', 'Deleted ', 'success');
            // console.log(vehicleID)
            else
              Swal.fire('Cancel', 'Cancel Deletion', 'info')

          }
        });
      } else {
        console.log("vehicleID is undefined or empty");
      }
    }
    function confirmDeletionDetails(){
      return true
      return false
    }
    function editDataDetails(){
      var dataID =  $(this).attr('id')
      if (dataID.includes('num') || dataID.includes('date'))
        return ;
      var orderID = getID(dataID)
      console.log(orderID)
      var currentData = $(this).text()
      var inputElement = $('<input type="text" class="form-control">').val(currentData)
      $(this).empty().append(inputElement);
      inputElement.focus();
      var beforeInput = currentData
      console.log("before", beforeInput)
      var originalElement = $(this);
      inputElement.blur(function() {
        var newData = $(this).val();
        $(this).parent().text(newData);

        if (newData !== currentData) {
          Swal.fire({
            title: 'Changes Confirmation',
            text: 'Are you sure to save these changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.isConfirmed) {
              console.log("orderID, new Data: ", orderID, newData)
              Swal.fire('Success', 'Changes saved', 'success');
            } else {
              // console.log("after", beforeInput)
              originalElement.text(beforeInput)
            }
          });
        }
      });

      $(`input`).on('keyup', function(event) {
        if (event.keyCode === 13) {
          $(this).blur();
        }
      });
      // call api change data
    }



    // Form Appear after click add button
  $("#addData").on("click", function () {
    $("#formAdd").addClass("show");
    $("#dataTable").css({
      opacity: "0.5",
      "pointer-events": "none",
    });
  });

  $("#closeForm_1").on("click", function () {
    $("#formAdd").addClass("hidden");
    $("#formAdd").removeClass("show");
    $("body").css("overflow", "auto");
    $("#dataTable").css({
      opacity: "",
      "pointer-events": "",
    });
  });

  function checkLicensePlate() {
    var urlParams = new URLSearchParams(window.location.search);
    var check = urlParams.get("exist");
    if (check) {
      popupDialog("Error", "This car is fixing !!!");
    }
  }
}
catch (error) {
    alert("Error: " + error);
  }
}

fetchData();