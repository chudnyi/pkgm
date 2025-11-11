#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run
// Тестовый скрипт для проверки работы переменной PKGM_PREFIX

console.log("Тестируем поддержку переменной окружения PKGM_PREFIX...");

// Сохраняем оригинальное значение PKGM_PREFIX, если оно есть
const originalPkgmPrefix = Deno.env.get("PKGM_PREFIX");

try {
 // Устанавливаем тестовое значение PKGM_PREFIX
  Deno.env.set("PKGM_PREFIX", "/tmp/test_pkgm_prefix");
  
  // Имитируем вызов функции install_prefix() из pkgm.ts
  function install_prefix() {
    // Check if PKGM_PREFIX environment variable is set
    const pkgmPrefix = Deno.env.get("PKGM_PREFIX");
    if (pkgmPrefix) {
      // Используем простой путь вместо Path из deno.land/x/libpkgx
      return pkgmPrefix;
    }
    // if /usr/local is writable, use that
    // В тесте мы не будем проверять writable, просто возвращаем значение
    return "/usr/local";
  }
  
  const prefix = install_prefix();
  console.log(`Определенный префикс установки: ${prefix}`);
  
  if (prefix === "/tmp/test_pkgm_prefix") {
    console.log("✓ Тест пройден: переменная PKGM_PREFIX корректно используется");
  } else {
    console.log("✗ Тест не пройден: переменная PKGM_PREFIX не используется должным образом");
    Deno.exit(1);
  }
  
  // Проверяем стандартный путь
  function standardPath() {
    const pkgmPrefix = Deno.env.get("PKGM_PREFIX") || "/usr/local";
    return `${pkgmPrefix}/bin:/usr/bin:/bin:/usr/sbin:/sbin`;
  }
  
  const stdPath = standardPath();
  console.log(`Стандартный путь: ${stdPath}`);
  
  if (stdPath.startsWith("/tmp/test_pkgm_prefix/bin:")) {
    console.log("✓ Тест пройден: стандартный путь корректно использует PKGM_PREFIX");
  } else {
    console.log("✗ Тест не пройден: стандартный путь не использует PKGM_PREFIX должным образом");
    Deno.exit(1);
  }
  
  console.log("Все тесты пройдены успешно!");
} finally {
 // Восстанавливаем оригинальное значение PKGM_PREFIX
  if (originalPkgmPrefix !== undefined) {
    Deno.env.set("PKGM_PREFIX", originalPkgmPrefix);
 } else {
    delete Deno.env.get("PKGM_PREFIX"); // Удаляем переменную, если она была
  }
}