#ifndef _HYPHENATE_DEFINES
#define _HYPHENATE_DEFINES

#include <cstdint>

#if _MSC_VER
#define snprintf _snprintf
#endif

#if defined( _WIN32 )
#  if defined( EASEMOB_EXPORTS ) || defined( DLL_EXPORT )
#    define EASEMOB_API __declspec( dllexport )
#  else
#    if defined( EASEMOB_IMPORTS ) || defined( DLL_IMPORT )
#      define EASEMOB_API __declspec( dllimport )
#    endif
#  endif
#endif

#ifndef EASEMOB_API
#  define EASEMOB_API
#endif

#endif
