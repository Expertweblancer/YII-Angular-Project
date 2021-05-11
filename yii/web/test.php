<?php
  $name = $_POST["name"];
  $email = $_POST["email"];

  if(!empty($name) && !empty($email)) {
    $to      = 'jordanbaron33@gmail.com';
    $subject = 'the subject';
    $message = 'hello';
    $headers = 'From: webmaster@example.com' . "\r\n" .
        'Reply-To: webmaster@example.com';

    mail($to, $subject, $message, $headers);
  } else {
    echo "P3N1S N1GGA";
  }

?>

<form method="post" action="">
  <input type="text" name="name">
  <input type="text" name="email">
  <button type="submit" name="submit">Contact Me</button>
</form>