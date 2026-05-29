/**
 * Lista de dominios de email temporal/desechable más comunes.
 * Se bloquean en el registro para evitar cuentas basura.
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Guerrilla Mail
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info',
  'guerrillamailblock.com', 'grr.la', 'sharklasers.com', 'spam4.me',
  // Mailinator
  'mailinator.com', 'mailinator2.com', 'mailinator.net',
  'safetymail.info', 'notmailinator.com',
  // YopMail
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf',
  'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr',
  'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
  // Temp-Mail
  'temp-mail.org', 'tempmail.com', 'tempail.com', 'tempemail.com',
  'tempinbox.com', 'temporaryemail.net', 'temporaryemail.us',
  'tempmailer.com', 'tempmailer.de', 'tempomail.fr',
  // Throwaway / Trash
  'throwaway.email', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trashmail.at', 'trashmail.io', 'trashmail.xyz', 'trashmail.org',
  'trash-mail.at', 'trashdevil.com', 'trashdevil.de', 'trashemail.de',
  'trashcanmail.com', 'trashimail.com', 'trashmail2.com',
  // Discard / Fake
  'discard.email', 'discardmail.com', 'discardmail.de', 'dispostable.com',
  'fakeinbox.com', 'fakeinbox.net', 'emailfake.com', 'fakemailgenerator.com',
  'fake-box.com', 'fake-email.com',
  // Spam / Block
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'spambog.com', 'spambog.de', 'spambog.ru', 'spam.la',
  'spambox.us', 'spambox.info', 'spamcorpse.com', 'spamevader.com',
  'spamfree24.de', 'spamfree24.eu', 'spamfree24.info',
  'spamhereplease.com', 'spamhole.com', 'spamkill.info',
  'spaml.com', 'spaml.de', 'spammotel.com', 'spammy.host',
  'spamoff.de', 'spamsalad.in', 'spamstack.net', 'spamspot.com',
  'spamthis.co.uk', 'spamthisplease.com', 'spamtroll.net',
  // Maildrop / Mailnull
  'maildrop.cc', 'mailnull.com', 'mailnull.org', 'mailscrap.com',
  'mailmetrash.com', 'mailexpire.com', 'meltmail.com', 'mintemail.com',
  // Wegwerf (alemán)
  'weg-werf-email.de', 'wegwerfadresse.de', 'wegwerfemail.com',
  'wegwerfemail.de', 'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org',
  'zehnminuten.de', 'zehnminutenmail.de',
  // Otros comunes
  'hmamail.com', 'dodgit.com', 'filzmail.com', 'fivemail.de',
  'getairmail.com', 'dump-email.info', 'dumpmail.de', 'dumpyemail.com',
  'easytrashmail.com', 'no-spam.ws', 'noclickemail.com',
  'nomail.pw', 'nomail2me.com', 'nospamthanks.info',
  'one-time.email', 'onewaymail.com', 'rcpt.at',
  'spoofmail.de', 'trbvm.com', 'zoemail.com', 'zoemail.net',
  'klzlk.com', 'crapmail.org', 'spam-be-gone.com',
  'owlpic.com', 'pookmail.com', 'proxymail.eu',
])
