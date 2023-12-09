<#import "theme.properties" as theme>
<#assign styles = theme.styles![]>

<!doctype html>
<html lang="en">
  <head>
      <title>PhoenixStock Keeper</title>
    <link rel="icon" type="image/png" href="${url.resourcesPath}/phoenix.png">
    <link rel="stylesheet" type="text/css" href="${url.resourcesPath}/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="${url.resourcesPath}/css/style.css">


  </head>
  <body>
    <div class="d-lg-flex half">

    <div class="bg order-1 order-md-2" style="background-image: url('${url.resourcesPath}/track.jpg'); background-size: cover; background-position: center;">
        <!-- Content inside the div goes here if needed -->
    </div>
      <div class="contents order-2 order-md-1">

        <!-- Logo at the top-left corner -->
        <div class="logo-container">
          <img src="${url.resourcesPath}/phoenixwbg.png" alt="PhoenixStock Keeper Logo" class="logo">
        </div>

        <div class="container">
          <div class="row align-items-center justify-content-center">
            <div class="col-md-7">
            <h3>Login to <strong>PhoenixStock Keeper</strong></h3>
            <p class="mb-4">Empower Your Business, Master Your Inventory.</p>
              <form action="${url.loginAction}" method="post">
                <div class="form-group first">
                  <label for="username">Username</label>
                  <input type="text" class="form-control" placeholder="your-email@phoenixmas.com" id="username" name="username">
                </div>
                <div class="form-group last mb-3">
                  <label for="password">Password</label>
                  <input type="password" class="form-control" placeholder="Your Password" id="password" name="password">
                </div>

                <div class="d-flex mb-5 align-items-center">
                  <label class="control control--checkbox mb-0">
                    <span class="caption">Remember me</span>
                    <input type="checkbox" checked="checked" name="rememberMe"/>
                    <div class="control__indicator"></div>
                  </label>
                  <span class="ml-auto"><a href="${url.loginResetCredentialsUrl}" class="forgot-pass">Forgot Password</a></span> 
                </div>

                <input type="submit" value="Log In" class="btn btn-block btn-primary">

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>