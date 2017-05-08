function red_alert(message){
    return (
        '<div class="alert alert-danger"> <i class="fa fa-exclamation-circle"></i> '
        + message
        + '</div>'
    );
}

function blue_alert(message){
    return (
        '<div class="alert alert-info"> <i class="fa fa-info-circle"></i> '
        + message
        + '</div>'
    );
}

function green_alert(message){
    return (
        '<div class="alert alert-success"> <i class="fa fa-info-circle"></i> '
        + message
        + '</div>'
    );
}