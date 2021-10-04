
$(function(){ //Start jQuery  
    const delay = $('#timeDelay').val()*1000;

    happymeal($('#show_meals'),'Seafood',delay);

    $('#show_meals').on('click','button[name="detailMeals"]',function(){
        const id = $(this).val();
        detailMeals(id)
    })

});

function happymeal(element, type, delay){
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/filter.php',
        type: 'get',
        data: {
            c: type
        },
        dataType: 'json',
        beforeSend: function(){
            element.html('<i class="fas fa-spinner "></i>');
        },
        success: function(data){

            $('#playLoop').click(function(){
                let newDelay = $('#timeDelay').val()*1000;
                loopMeals = setInterval(function(){
                    autoloop(data.meals,type,element)
                },newDelay)
                $('#playLoop, #timeDelay').attr('disabled','disalbed')
                toastSwal('success', 'เล่นลูปต่อ')
            })


            autoloop(data.meals,type,element)
            
            let loopMeals = setInterval(function(){
                autoloop(data.meals,type,element)
            },delay)

            

            $('#pauseLoop').click(function(){
                clearInterval(loopMeals);
                $('#playLoop, #timeDelay').removeAttr('disabled');
                toastSwal('success', 'หยุดลูป')
            })

        }
    })
}

function detailMeals(id){
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/lookup.php',
        type: 'get',
        data:{
            i:id
        },
        dataType: 'json',
        beforeSend: function(){
            $('#DetailMealsMD').modal('show');
            $('#DetailMealsMDBody').html('<div class="col-12 bg-light"><i class="fas fa-spinner "></i></div>');
        },
        success: function(data){
            let output = '';
            output +=   '<div class="card" >'+
                            '<img src="'+data.meals[0].strMealThumb+'" class="card-img-top" alt="">'+
                            '<div class="card-body">'+
                            '<h5 class="card-title"><i class="fas fa-utensils text-warning"></i> '+data.meals[0].strMeal+'</h5>'+
                            '<p class="card-text text-truncate">'+data.meals[0].strInstructions+'</p>'+
                            '</div>'+
                            '<ul class="list-group list-group-flush">'+
                                '<li class="list-group-item"><span class="fw-bold">Category: </span> '+data.meals[0].strCategory+'</li>'+
                                '<li class="list-group-item"><span class="fw-bold">Area: </span>'+data.meals[0].strArea+'</li>'+
                            '</ul>'+
                            '<div class="card-body">'+
                                '<a href="'+data.meals[0].strSource+'" class="card-link  target="_blank">แหล่งที่มา</a>'+
                            '</div>'+
                        '</div>';
            $('#DetailMealsMDBody').html(output);
        }
    })
}

function autoloop(data,type,element){
    
    let output = '';
    for(let i=0; i<data.length; i++){
        output +=  '<div class="col" >'+
                        '<div class="card ">'+
                            '<img src="'+data[i].strMealThumb+'" class="card-img-top" alt="">'+
                            '<div class="card-body">'+
                            '<h5 class="card-title text-truncate" title="'+type+'">'+data[i].strMeal+'</h5>'+
                                '<p class="card-text text-truncate" title="'+type+'">'+
                                type+
                                '</p>'+
                            '<button name="detailMeals" class="btn btn-primary btn-sm shadow-none" value="'+data[i].idMeal+'"><i class="fas fa-search align-middle"></i> ดูรายละเอียด</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
    }
    element.html(output)
    let first = data.shift();
    data.push(first);

}

function toastSwal(icon,title){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 400,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: icon,
        title: title
      })
}


