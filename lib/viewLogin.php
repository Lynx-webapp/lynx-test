<?php
    global $router;
    $OtherThings = new OtherThings();
?>

<!doctype html>
<html lang="fr">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <?php inc("view/cssLibs.php");?>
    <?php inc("view/viewNav.php"); ?>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

    <title>LeakZ - Login</title>
  </head>
  <body class="mx-auto">
    <h1 class="text-center" style="padding-top:12%">Connexion</h1>
    <div class="card mx-auto" style="width: 22rem;">
      <div class="card-body mx-auto">
        <form method="POST">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" name="username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password">

          </div>
          <?php 
            if(CAPTCHA_SECURITY_ACTIVATED)
            {
              $captcha = $OtherThings->generateCaptcha();
              echo "<div class='row'><img class='col-md-4' src='data:image/png;base64,$captcha'><input class='col-md-4' class='form-control'  name='captchaCode'></div><br>";
            }
          ?>
          <button type="submit" class="btn btn-primary">Connexion</button>
          <a href="<?=$router->baseUrl?>/register">Create An Account</a>
        </form>
      </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
  </body>
</html>
