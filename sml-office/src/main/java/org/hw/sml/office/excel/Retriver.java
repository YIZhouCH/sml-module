package org.hw.sml.office.excel;

import java.util.List;

public interface Retriver {
	 <T> List<T> retrive(int start, int limit);
}
