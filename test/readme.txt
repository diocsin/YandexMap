Для того что бы использовать Sencha Test.
1. Скачать sencha Test STC с официального сайта.
2. Установить или обновить Node.js до 6 или 7 версии.
3. С помощью Node.install установать STC.
4. Возможно понадобится chromedriver. Скачать с офф сайта.
5. Запустить Sencha app watch на порту который указан в project.json, subjectUrl.
6. Запустить тест 'stc run -s test/New_Scenario_1 -p embedded' . Запускать из директории проекта под своим
пользователем (не root, под root не запускается chrome).
