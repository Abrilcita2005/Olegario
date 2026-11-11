# APK de Android — cómo se arma (Etapa 15, D-81)

La APK se instala directo en el teléfono (no pasa por Google Play). Identificador
`com.olegario.enmovimiento`; usa el servidor de Hostinger (`EXPO_PUBLIC_API_URL` en `.env`).

## Armarla en la nube

Necesita Java 17, el SDK de Android en `/opt/android-sdk` y estos sitios habilitados en el entorno:
`dl.google.com` y `repo.reactnative.dev` (Maven Central a veces responde "demasiados pedidos": se
reintenta y lo ya descargado queda guardado).

1. `.env` con `EXPO_PUBLIC_API_URL=https://www.supervisioncct3.com/olegario`.
2. `EXPO_OFFLINE=1 CI=1 npx expo prebuild --platform android --no-install` (genera `android/`, que no va a
   GitHub; si cambia los scripts de `package.json`, se deshace con `git checkout package.json`).
3. En `android/`:
   `JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ANDROID_HOME=/opt/android-sdk NODE_ENV=production ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a`
4. Firmar con la firma de Olegario (la guarda la responsable):
   `apksigner sign --ks olegario-firma.jks --ks-key-alias olegario --out olegario-en-movimiento-X.Y.Z.apk android/app/build/outputs/apk/release/app-release.apk`

## Versiones nuevas

Antes de armar una versión nueva, subir `version` y `versionCode` en `app.json` y firmar **siempre con
el mismo archivo de firma**: si cambia, los teléfonos no aceptan la actualización.
