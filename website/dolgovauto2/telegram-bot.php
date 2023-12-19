<?php
if($_SERVER['REQUEST_METHOD'] == "POST"){

    $secret_token = "TOKEN_BOT_TELEGRAM_ANDA";
    $telegram_id = $_POST ['telegram_id'];
    $pesan_teks = $_POST ['pesan_teks'];

function sendMessage($telegram_id, $pesan_teks, $secret_token) {
    $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?chat_id=" . $telegram_id;
    $url = $url . "&text=" . urlencode($pesan_teks);
    $ch = curl_init();
    $optArray = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true
    );
    curl_setopt_array($ch, $optArray);
    $result = curl_exec($ch);
    curl_close($ch);
}

sendMessage($telegram_id, $pesan_teks, $secret_token);
echo "<script>alert('Pesan berhasil terkirim!'); window.location.href = 'index_single_page.php';</script>";
}
?>
<div class="content">
 <section class="content-header">
   <i class="fa fa-home"></i> Home / <i class="fa fa-dashboard"></i> Dashboard / <b>PHP Form (single page)</b>
 </section>

    <section class="content">
     <div class="col-md-6">
        <div class="box box-primary">
            <div class="box-header">
                <h5 class="box-title">Telegram bots form</h5>
            </div>

            <div class="box-body">
            <form method="POST">
                <div class="form-group row">
                            <label class="col-md-4 col-form-label">Telegram ID</label>
                            <div class="col-md-8">
                            <input type="text" class="form-control" name="telegram_id" placeholder="Telegram ID ..." required>
                            </div>
                            </div>
                <div class="form-group row">
                            <label class="col-md-4 col-form-label">Message</label>
                            <div class="col-md-8">
                            <textarea class="form-control" rows="4" name="pesan_teks" placeholder="Masukkan pesan disini ..." required></textarea>
                            </div>
                            </div>
                  <button type="submit" name="submit" class="btn btn-primary pull-right">Send <i class="fa fa-send"></i></button>
                  <br>
            </form>
            </div>
        </div>
        </div>
    </section>