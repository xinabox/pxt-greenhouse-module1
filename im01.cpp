#include "pxt.h"
#include "mbed.h"
#include "SDFileSystem.h"
#include "MicroBit.h"

namespace im01
{
	//%
	bool _file(String s, String v, String x)
	{
		SDFileSystem sd(P0_21, P0_22, P0_23, P0_16, "sd");
		FILE *fp = fopen((const char *)s->getUTF8Data(), (const char *)x->getUTF8Data());
		if (fp == NULL)
			return false;

		fprintf(fp, (const char *)v->getUTF8Data());
		fclose(fp);
		return true;
	}

} // namespace im01