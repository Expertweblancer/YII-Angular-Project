Wytyczne:

- zrzut bazy danych jest w pliku:shipme.dev.sql, należy ją wczytać do bazy
dane bazy danych zmienia się w yii/config/db.php - gdzie ustawaia się użytkownika, hasło, adres serwera bazy danych

- dane serwera - backendu z którym łączy się angular (frontend) zmienia się w angular\src\app\definitions.ts - 
zmienna backendUrl - należy tam podać domenę pod którą jest serwer.

- utwórz katalog "assets" w yii/web/ jeśli go tam nie ma.



Wykonaj test czy działa angular i czy prawidłowo łączy się z backendem

wejdź na adres backendu. np. services.transovia.com
utwórz konto, potwierdź email.
UWAGA: email przyjdzie z innej domeny - w obecnej wersji, bo nie ma jeszcze utworzonego emailu: admin@transovia.com

trzeba tam kliknąć link potwierdzający założenie konta.
w momencie, kiedy aktualizuję to readme - nie ma automatycznego przejścia do angulara, więc wpisz do przeglądarki transovia.com
zaloguj się podając usera i password,

jest tam testowa zakładka: heros się nazywa
służy ona do przetestowania czy jest wszystko dobrze połączone.

po zalogowaniu przejdź do tej zakładki i zobac czy pokazuje się lista. spróbuj dodać do niej jakiąś nazwę, nazwa powinna się pokazać na liście. 
Jeśli się pokazuje to znaczy, że wszystko jest miodzio..


