<?php
echo 'dump';
echo exec('mysqldump --user=root --password= --host=localhost oldshipme > dumpfile1.sql');

?>